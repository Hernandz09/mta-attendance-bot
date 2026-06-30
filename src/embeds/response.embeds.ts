import { EmbedBuilder } from 'discord.js';
import { BUSINESS_RULES } from '../config/business';
import {
  ATTENDANCE_STATUS_LABELS,
  EMBED_COLORS,
  EMPTY_DISPLAY_VALUE,
} from '../config/constants';
import {
  AttendanceStatus,
  AttendanceStatusResult,
} from '../interfaces/attendance.interface';

export function buildEntrySuccessEmbed(
  date: string,
  entryTime: string,
  status: AttendanceStatus,
): EmbedBuilder {
  const statusLabel = ATTENDANCE_STATUS_LABELS[status] ?? status;

  return new EmbedBuilder()
    .setColor(EMBED_COLORS.SUCCESS)
    .setTitle('Entrada registrada')
    .setDescription('Tu asistencia de hoy quedó registrada correctamente.')
    .addFields(
      { name: 'Fecha', value: date, inline: true },
      { name: 'Hora', value: entryTime, inline: true },
      { name: 'Estado', value: statusLabel, inline: true },
    );
}

export function buildExitSuccessEmbed(
  date: string,
  exitTime: string,
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(EMBED_COLORS.SUCCESS)
    .setTitle('Salida registrada')
    .setDescription('Tu salida quedó registrada correctamente.')
    .addFields(
      { name: 'Fecha', value: date, inline: true },
      { name: 'Hora', value: exitTime, inline: true },
    );
}

export function buildAttendanceStatusEmbed(
  status: AttendanceStatusResult,
): EmbedBuilder {
  const entry = status.entryTime ?? EMPTY_DISPLAY_VALUE;
  const exit = status.exitTime ?? EMPTY_DISPLAY_VALUE;
  const statusLabel =
    ATTENDANCE_STATUS_LABELS[status.status] ?? status.status;

  return new EmbedBuilder()
    .setColor(EMBED_COLORS.INFO)
    .setTitle(`Asistencia del día (${status.date})`)
    .addFields(
      { name: 'Entrada', value: entry, inline: true },
      { name: 'Salida', value: exit, inline: true },
      { name: 'Estado', value: statusLabel, inline: false },
    );
}

export function buildEntryHoursClosedEmbed(): EmbedBuilder {
  const { start, end } = BUSINESS_RULES.entryWindow;

  return new EmbedBuilder()
    .setColor(EMBED_COLORS.WARNING)
    .setTitle('Horario de registro finalizado')
    .setDescription(
      `El registro de entrada solo está disponible entre las **${start}** y las **${end}**.\n\nIntenta nuevamente dentro del horario permitido.`,
    );
}

export function buildErrorEmbed(message: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(EMBED_COLORS.ERROR)
    .setDescription(message);
}

export function buildGenericErrorEmbed(): EmbedBuilder {
  return buildErrorEmbed(
    'Ocurrió un error al procesar tu solicitud. Intenta de nuevo.',
  );
}

export function buildUnknownSubcommandEmbed(): EmbedBuilder {
  return buildErrorEmbed('Subcomando no reconocido.');
}
