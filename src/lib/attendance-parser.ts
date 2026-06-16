import ExcelJS from "exceljs";
import type {
  ColumnMapping,
  ParsedFile,
  ParsedRow,
  ScanType,
  ValidatedRow,
} from "@/lib/attendance-types";

const PIN_HEADERS = ["nip", "pin", "kode", "employeepin", "emp pin"];
const NAME_HEADERS = ["nama", "name", "employee", "id name"];
const DATE_HEADERS = ["tanggal", "date"];
const TIME_HEADERS = ["jam", "time", "scan time"];
const STATUS_HEADERS = ["status", "scan type", "type"];
const DEVICE_HEADERS = ["mesin", "device", "devicecode", "terminal"];

function normalizeHeader(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function detectHeader(headers: string[], candidates: string[]): string | null {
  const normalizedCandidates = candidates.map((candidate) =>
    normalizeHeader(candidate),
  );

  return (
    headers.find((header) =>
      normalizedCandidates.includes(normalizeHeader(header)),
    ) ?? null
  );
}

export function autoMapColumns(headers: string[]): ColumnMapping {
  return {
    pin: detectHeader(headers, PIN_HEADERS),
    name: detectHeader(headers, NAME_HEADERS),
    date: detectHeader(headers, DATE_HEADERS),
    time: detectHeader(headers, TIME_HEADERS),
    status: detectHeader(headers, STATUS_HEADERS),
    device: detectHeader(headers, DEVICE_HEADERS),
  };
}

function parseCsv(content: string): ParsedFile {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rows = lines.map((line) =>
    line
      .split(",")
      .map((cell) => cell.trim().replace(/^"|"$/g, "")),
  );

  const [headers, ...body] = rows;

  return {
    headers: headers ?? [],
    rows: body,
  };
}

async function parseXlsx(file: File): Promise<ParsedFile> {
  const workbook = new ExcelJS.Workbook();
  const buffer = await file.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  const matrix: string[][] = [];

  worksheet.eachRow((row) => {
    const values = row.values as Array<string | number | Date | null | undefined>;
    const cells = values
      .slice(1)
      .map((value) => (value == null ? "" : String(value).trim()));
    matrix.push(cells);
  });

  const [headers, ...body] = matrix.filter((row) => row.some(Boolean));

  return {
    headers: headers ?? [],
    rows: body,
  };
}

export async function parseFile(file: File): Promise<ParsedFile> {
  const lower = file.name.toLowerCase();

  if (lower.endsWith(".csv")) {
    const content = await file.text();
    return parseCsv(content);
  }

  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
    return parseXlsx(file);
  }

  throw new Error("Format file tidak didukung. Gunakan CSV atau XLSX.");
}

function normalizeScanType(value: string | null | undefined): ScanType {
  const normalized = (value ?? "").toLowerCase().trim();
  if (["in", "checkin", "masuk"].includes(normalized)) return "IN";
  if (["out", "checkout", "keluar"].includes(normalized)) return "OUT";
  if (["break_in", "breakin"].includes(normalized)) return "BREAK_IN";
  if (["break_out", "breakout"].includes(normalized)) return "BREAK_OUT";
  return "UNKNOWN";
}

function buildRawRecord(headers: string[], row: string[]): Record<string, string> {
  return headers.reduce<Record<string, string>>((acc, header, index) => {
    return {
      ...acc,
      [header]: row[index] ?? "",
    };
  }, {});
}

function buildIsoDate(date: string, time: string): string | null {
  const rawDate = date.trim();
  const rawTime = time.trim() || "00:00:00";

  const normalizedDate = rawDate.includes("/")
    ? rawDate.split("/").join("-")
    : rawDate;

  const value = new Date(`${normalizedDate}T${rawTime}`);
  if (Number.isNaN(value.getTime())) return null;
  return value.toISOString();
}

function createSourceHash(pin: string, scanAt: string | null, deviceCode: string | null): string {
  return `${pin}__${scanAt ?? "invalid"}__${deviceCode ?? "unknown"}`;
}

export function parseRows(
  headers: string[],
  rows: string[][],
  mapping: ColumnMapping,
): ParsedRow[] {
  return rows.map((row, index) => {
    const raw = buildRawRecord(headers, row);
    const dateValue = mapping.date ? raw[mapping.date] ?? "" : "";
    const timeValue = mapping.time ? raw[mapping.time] ?? "" : "";

    return {
      rowNumber: index + 2,
      pin: mapping.pin ? raw[mapping.pin] ?? "" : "",
      name: mapping.name ? (raw[mapping.name] ?? "") || null : null,
      scanAt: buildIsoDate(dateValue, timeValue),
      scanType: normalizeScanType(mapping.status ? raw[mapping.status] : null),
      deviceCode: mapping.device ? (raw[mapping.device] ?? "") || null : null,
      raw,
    };
  });
}

export function validateRows(
  rows: ParsedRow[],
  knownPins: string[],
): ValidatedRow[] {
  return rows.map((row) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!row.pin.trim()) errors.push("PIN/NIP kosong");
    if (!row.scanAt) errors.push("Tanggal/Jam tidak valid");
    if (row.scanType === "UNKNOWN") warnings.push("Scan type tidak dikenali");
    if (row.pin && !knownPins.includes(row.pin)) {
      warnings.push("PIN belum cocok dengan data karyawan");
    }

    return {
      ...row,
      errors,
      warnings,
      isValid: errors.length === 0,
      sourceHash: createSourceHash(row.pin, row.scanAt, row.deviceCode),
    };
  });
}

export function buildImportStats(rows: ValidatedRow[]) {
  return {
    total: rows.length,
    valid: rows.filter((row) => row.isValid).length,
    warnings: rows.filter((row) => row.warnings.length > 0).length,
    errors: rows.filter((row) => row.errors.length > 0).length,
  };
}
