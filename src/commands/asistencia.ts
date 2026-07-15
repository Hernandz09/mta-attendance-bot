import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import {
  buildAttendanceStatusEmbed,
  buildErrorEmbed,
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
      await interaction.reply({
        embeds: [buildErrorEmbed(error.userMessage)],
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
