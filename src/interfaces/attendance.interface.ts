import { ATTENDANCE_STATUS } from '../config/constants';

export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

export interface AttendanceRecord {
  rowIndex: number;
  discordId: string;
  username: string;
  date: string;
  entryTime: string;
  exitTime: string;
  status: string;
}

export interface AttendanceStatusResult {
  date: string;
  entryTime: string | null;
  exitTime: string | null;
  status: AttendanceStatus;
}
