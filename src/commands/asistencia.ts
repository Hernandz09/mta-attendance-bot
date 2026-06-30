import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import {
  buildAttendanceStatusEmbed,
  buildEntryHoursClosedEmbed,
  buildEntrySuccessEmbed,
  buildErrorEmbed,
  buildExitSuccessEmbed,
  buildGenericErrorEmbed,
  buildUnknownSubcommandEmbed,
} from '../embeds/response.embeds';
import { AttendanceService } from '../services/attendanceService';
import { BotCommand } from '../types/command.type';
import { isAttendanceError } from '../utils/errors';
import { logger } from '../utils/logger';

const data = new SlashCommandBuilder()
  .setName('asistencia')
  .setDescription('Gestión de asistencia de practicantes')
  .addSubcommand((sub) =>
    sub.setName('entrada').setDescription('Registrar hora de entrada'),
  )
  .addSubcommand((sub) =>
    sub.setName('salida').setDescription('Registrar hora de salida'),
  )
  .addSubcommand((sub) =>
    sub
      .setName('estado')
      .setDescription('Consultar tu asistencia del día'),
  );

async function execute(
  interaction: ChatInputCommandInteraction,
  attendanceService: AttendanceService,
): Promise<void> {
  const subcommand = interaction.options.getSubcommand();

  try {
    switch (subcommand) {
      case 'entrada':
        await handleEntrada(interaction, attendanceService);
        break;
      case 'salida':
        await handleSalida(interaction, attendanceService);
        break;
      case 'estado':
        await handleEstado(interaction, attendanceService);
        break;
      default:
        await interaction.reply({
          embeds: [buildUnknownSubcommandEmbed()],
          flags: MessageFlags.Ephemeral,
        });
    }
  } catch (error) {
    if (isAttendanceError(error)) {
      const embed =
        error.type === 'entry_hours_closed'
          ? buildEntryHoursClosedEmbed()
          : buildErrorEmbed(error.userMessage);

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    logger.error(`Error en /asistencia ${subcommand}:`, error);
    await interaction.reply({
      embeds: [buildGenericErrorEmbed()],
      flags: MessageFlags.Ephemeral,
    });
  }
}

async function handleEntrada(
  interaction: ChatInputCommandInteraction,
  attendanceService: AttendanceService,
): Promise<void> {
  const { date, entryTime, status } = await attendanceService.registerEntry(
    interaction.user.id,
    interaction.user.username,
  );

  await interaction.reply({
    embeds: [buildEntrySuccessEmbed(date, entryTime, status)],
    flags: MessageFlags.Ephemeral,
  });
}

async function handleSalida(
  interaction: ChatInputCommandInteraction,
  attendanceService: AttendanceService,
): Promise<void> {
  const { date, exitTime } = await attendanceService.registerExit(
    interaction.user.id,
  );

  await interaction.reply({
    embeds: [buildExitSuccessEmbed(date, exitTime)],
    flags: MessageFlags.Ephemeral,
  });
}

async function handleEstado(
  interaction: ChatInputCommandInteraction,
  attendanceService: AttendanceService,
): Promise<void> {
  const status = await attendanceService.getTodayStatus(interaction.user.id);

  await interaction.reply({
    embeds: [buildAttendanceStatusEmbed(status)],
    flags: MessageFlags.Ephemeral,
  });
}

export const asistenciaCommand: BotCommand = {
  data,
  execute,
};

export { data, execute };

