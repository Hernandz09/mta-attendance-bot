import { DEFAULT_TIMEZONE } from './constants';

/**
 * Reglas de negocio del bot.
 * Ajusta estos valores para cambiar horarios sin modificar los servicios.
 */
export const BUSINESS_RULES = {
  timezone: DEFAULT_TIMEZONE,
  entryWindow: {
    start: '07:00',
    end: '14:00',
  },
  punctuality: {
    onTimeUntil: '07:30',
  },
} as const;

export function resolveBusinessTimezone(envTimezone?: string): string {
  return envTimezone ?? BUSINESS_RULES.timezone;
}
