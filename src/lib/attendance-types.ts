export type ScanType = "IN" | "OUT" | "BREAK_IN" | "BREAK_OUT" | "UNKNOWN";

export type UploadState =
  | "idle"
  | "parsing"
  | "preview"
  | "importing"
  | "done"
  | "error";

export type ColumnMapping = {
  pin: string | null;
  name: string | null;
  date: string | null;
  time: string | null;
  status: string | null;
  device: string | null;
};

export type ParsedFile = {
  headers: string[];
  rows: string[][];
};

export type ParsedRow = {
  rowNumber: number;
  pin: string;
  name: string | null;
  scanAt: string | null;
  scanType: ScanType;
  deviceCode: string | null;
  raw: Record<string, string>;
};

export type ValidatedRow = ParsedRow & {
  errors: string[];
  warnings: string[];
  isValid: boolean;
  sourceHash: string;
};

export type ImportStats = {
  total: number;
  valid: number;
  warnings: number;
  errors: number;
  imported?: number;
  skipped?: number;
};

export type ImportApiRequest = {
  rows: ValidatedRow[];
  fileName: string;
};

export type ImportApiResponse = {
  success: boolean;
  stats: ImportStats;
  message: string;
};
