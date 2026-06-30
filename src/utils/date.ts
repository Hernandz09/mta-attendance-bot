import { BUSINESS_RULES } from '../config/business';
import { ATTENDANCE_STATUS } from '../config/constants';
import { AttendanceStatus } from '../interfaces/attendance.interface';

export function getTodayDate(timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function getCurrentTime(timezone: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
}

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function isWithinEntryWindow(currentTime: string): boolean {
  const current = parseTimeToMinutes(currentTime);
  const start = parseTimeToMinutes(BUSINESS_RULES.entryWindow.start);
  const end = parseTimeToMinutes(BUSINESS_RULES.entryWindow.end);
  return current >= start && current <= end;
}

export function resolveEntryPunctualityStatus(
  currentTime: string,
): AttendanceStatus {
  const current = parseTimeToMinutes(currentTime);
  const deadline = parseTimeToMinutes(BUSINESS_RULES.punctuality.onTimeUntil);

  return current <= deadline
    ? ATTENDANCE_STATUS.PUNTUAL
    : ATTENDANCE_STATUS.TARDANZA;
}
