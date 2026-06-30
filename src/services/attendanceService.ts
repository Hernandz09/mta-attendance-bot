import { AppConfig } from '../config/env';
import { ATTENDANCE_STATUS } from '../config/constants';
import {
  AttendanceStatus,
  AttendanceStatusResult,
} from '../interfaces/attendance.interface';
import { AttendanceError } from '../utils/errors';
import {
  getCurrentTime,
  getTodayDate,
  isWithinEntryWindow,
  resolveEntryPunctualityStatus,
} from '../utils/date';
import { SheetsService } from './sheetsService';

export class AttendanceService {
  private sheetsService: SheetsService;
  private timezone: string;

  constructor(config: AppConfig) {
    this.sheetsService = new SheetsService(config.google);
    this.timezone = config.timezone;
  }

  async initialize(): Promise<void> {
    await this.sheetsService.ensureSheetExists();
  }

  async registerEntry(
    discordId: string,
    username: string,
  ): Promise<{ date: string; entryTime: string; status: AttendanceStatus }> {
    const date = getTodayDate(this.timezone);
    const entryTime = getCurrentTime(this.timezone);

    const existing = await this.sheetsService.findTodayRecord(discordId, date);

    if (existing) {
      throw new AttendanceError(
        'Entry already exists for today',
        'Ya registraste tu entrada hoy.',
      );
    }

    if (!isWithinEntryWindow(entryTime)) {
      throw new AttendanceError(
        'Entry outside allowed hours',
        'El horario de registro de entrada ha finalizado.',
        'entry_hours_closed',
      );
    }

    const status = resolveEntryPunctualityStatus(entryTime);

    await this.sheetsService.appendEntry(
      discordId,
      username,
      date,
      entryTime,
      status,
    );

    return { date, entryTime, status };
  }

  async registerExit(
    discordId: string,
  ): Promise<{ date: string; exitTime: string }> {
    const date = getTodayDate(this.timezone);
    const exitTime = getCurrentTime(this.timezone);

    const record = await this.sheetsService.findTodayRecord(discordId, date);

    if (!record) {
      throw new AttendanceError(
        'No entry found for today',
        'No tienes una entrada registrada hoy. Usa `/asistencia entrada` primero.',
      );
    }

    if (record.exitTime) {
      throw new AttendanceError(
        'Exit already registered',
        'Ya registraste tu salida hoy.',
      );
    }

    await this.sheetsService.updateExit(record.rowIndex, exitTime);

    return { date, exitTime };
  }

  async getTodayStatus(discordId: string): Promise<AttendanceStatusResult> {
    const date = getTodayDate(this.timezone);
    const record = await this.sheetsService.findTodayRecord(discordId, date);

    if (!record) {
      return {
        date,
        entryTime: null,
        exitTime: null,
        status: ATTENDANCE_STATUS.SIN_REGISTRO,
      };
    }

    const status = this.resolveStoredStatus(record.status);

    return {
      date: record.date,
      entryTime: record.entryTime || null,
      exitTime: record.exitTime || null,
      status,
    };
  }

  private resolveStoredStatus(storedStatus: string): AttendanceStatus {
    if (storedStatus === ATTENDANCE_STATUS.PUNTUAL) {
      return ATTENDANCE_STATUS.PUNTUAL;
    }

    if (storedStatus === ATTENDANCE_STATUS.TARDANZA) {
      return ATTENDANCE_STATUS.TARDANZA;
    }

    return ATTENDANCE_STATUS.SIN_REGISTRO;
  }
}
