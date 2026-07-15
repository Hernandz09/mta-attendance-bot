export const SHEET_NAME = 'Asistencias';

export const SHEET_HEADERS = [
  'discord_id',
  'username',
  'fecha',
  'hora_entrada',
  'hora_salida',
  'estado',
] as const;

export const SHEET_HEADER_RANGE = `${SHEET_NAME}!A1:F1`;
export const SHEET_DATA_RANGE = `${SHEET_NAME}!A:F`;

export const DEFAULT_TIMEZONE = 'America/Mexico_City';

export const ATTENDANCE_STATUS = {
  PUNTUAL: 'Puntual',
  TARDANZA: 'Tardanza',
  SIN_REGISTRO: 'Sin registro',
} as const;

export const ATTENDANCE_STATUS_LABELS: Record<
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS],
  string
> = {
  [ATTENDANCE_STATUS.PUNTUAL]: 'Puntual',
  [ATTENDANCE_STATUS.TARDANZA]: 'Tardanza',
  [ATTENDANCE_STATUS.SIN_REGISTRO]: 'Sin registro',
};

export const GOOGLE_SHEETS_SCOPE =
  'https://www.googleapis.com/auth/spreadsheets';

export const COMMAND_NAMES = {
  ASISTENCIA: 'asistencia',
} as const;

export const BUTTON_CUSTOM_IDS = {
  MARCAR_ENTRADA: 'marcar_entrada',
  MARCAR_SALIDA: 'marcar_salida',
} as const;

export const EMPTY_DISPLAY_VALUE = '—';

export const EMBED_COLORS = {
  SUCCESS: 0x57f287,
  ERROR: 0xed4245,
  INFO: 0x5865f2,
  WARNING: 0xfee75c,
} as const;
