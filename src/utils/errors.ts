export type AttendanceErrorType = 'default' | 'entry_hours_closed';

export class AttendanceError extends Error {
  constructor(
    message: string,
    public readonly userMessage: string,
    public readonly type: AttendanceErrorType = 'default',
  ) {
    super(message);
    this.name = 'AttendanceError';
  }
}

export function isAttendanceError(error: unknown): error is AttendanceError {
  return error instanceof AttendanceError;
}
