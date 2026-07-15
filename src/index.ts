import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { loadConfig } from './config/env';
import { registerReadyWithInit } from './events/ready';
import { registerButtonHandler } from './handlers/buttonHandler';
import { registerCommandHandler } from './handlers/commandHandler';
import { AttendanceService } from './services/attendanceService';
import { logger } from './utils/logger';

async function main(): Promise<void> {
  const config = loadConfig();
  const attendanceService = new AttendanceService(config);

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  registerReadyWithInit(client, attendanceService, config);
  registerCommandHandler(client, attendanceService);
  registerButtonHandler(client, attendanceService);

  await client.login(config.discord.token);
}

main().catch((error) => {
  logger.error('Error fatal al iniciar el bot:', error);
  process.exit(1);
});
