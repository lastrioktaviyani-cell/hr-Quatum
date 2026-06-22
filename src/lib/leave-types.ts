export type LeaveType =
  | "CUTI_TAHUNAN"
  | "CUTI_SAKIT"
  | "IZIN"
  | "CUTI_MELAHIRKAN"
  | "CUTI_KHUSUS";

export type LeaveStatus = "MENUNGGU" | "DISETUJUI" | "DITOLAK" | "DIBATALKAN";

export type LeaveRequest = {
  readonly id: string;
  readonly employeeId: string;
  readonly type: LeaveType;
  readonly startDate: string;
  readonly endDate: string;
  readonly durationDays: number;
  readonly reason: string;
  readonly documentUrl: string | null;
  readonly status: LeaveStatus;
  readonly rejectReason: string | null;
  readonly approverId: string | null;
  readonly approvedAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly employee: {
    readonly id: string;
    readonly employeeNumber: string;
    readonly fullName: string;
  };
};
