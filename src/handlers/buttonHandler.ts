import {
  ButtonInteraction,
  Client,
  Events,
  MessageFlags,
} from 'discord.js';
import { BUTTON_CUSTOM_IDS } from '../config/constants';
import {
  buildEntryHoursClosedEmbed,
  buildEntrySuccessEmbed,
  buildErrorEmbed,
  buildExitSuccessEmbed,
  buildGenericErrorEmbed,
} from '../embeds/response.embeds';
import { AttendanceService } from '../services/attendanceService';
import { isAttendanceError } from '../utils/errors';
import { logger } from '../utils/logger';

async function handleMarcarEntrada(
  interaction: ButtonInteraction,
  attendanceService: AttendanceService,
): Promise<void> {
  const { date, entryTime, status } = await attendanceService.registerEntry(
    interaction.user.id,
    interaction.user.username,
  );

  await interaction.editReply({
    embeds: [buildEntrySuccessEmbed(date, entryTime, status)],
  });
}

async function handleMarcarSalida(
  interaction: ButtonInteraction,
  attendanceService: AttendanceService,
): Promise<void> {
  const { date, exitTime } = await attendanceService.registerExit(
    interaction.user.id,
  );

  await interaction.editReply({
    embeds: [buildExitSuccessEmbed(date, exitTime)],
  });
}

export function registerButtonHandler(
  client: Client,
  attendanceService: AttendanceService,
): void {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    if (
      customId !== BUTTON_CUSTOM_IDS.MARCAR_ENTRADA &&
      customId !== BUTTON_CUSTOM_IDS.MARCAR_SALIDA
    ) {
      return;
    }

    try {
      // Ack inmediato: Sheets + dashboard suelen superar el límite de 3s de Discord
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      if (customId === BUTTON_CUSTOM_IDS.MARCAR_ENTRADA) {
        await handleMarcarEntrada(interaction, attendanceService);
        return;
      }

      await handleMarcarSalida(interaction, attendanceService);
    } catch (error) {
      const embed = isAttendanceError(error)
        ? error.type === 'entry_hours_closed'
          ? buildEntryHoursClosedEmbed()
          : buildErrorEmbed(error.userMessage)
        : buildGenericErrorEmbed();

      if (!isAttendanceError(error)) {
        logger.error(`Error en botón ${customId}:`, error);
      }

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    }
  });
}
