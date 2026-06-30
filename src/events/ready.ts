import { Client, Events } from 'discord.js';
import { AttendanceService } from '../services/attendanceService';
import { logger } from '../utils/logger';

export function registerReadyWithInit(
  client: Client,
  attendanceService: AttendanceService,
): void {
  client.once(Events.ClientReady, async (readyClient) => {
    try {
      await attendanceService.initialize();
      logger.info(`Bot conectado como ${readyClient.user.tag}`);
      logger.info('Google Sheets inicializado correctamente');
    } catch (error) {
      logger.error('Error al inicializar Google Sheets:', error);
      process.exit(1);
    }
  });
}
