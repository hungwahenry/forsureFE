export type ReportTargetType = 'USER' | 'ACTIVITY' | 'MESSAGE';

export type ReportStatus = 'PENDING' | 'REVIEWED' | 'DISMISSED';

export interface ReportReason {
  id: string;
  code: string;
  label: string;
  description: string | null;
}

export interface Report {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  status: ReportStatus;
  reasonId: string;
  details: string | null;
  createdAt: string;
}

export interface ReportTarget {
  type: ReportTargetType;
  id: string;
}
