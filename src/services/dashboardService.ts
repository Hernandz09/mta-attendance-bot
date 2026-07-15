import { DashboardConfig } from '../config/dashboard';
import { logger } from '../utils/logger';

export class DashboardService {
  private apiUrl: string;
  private apiKey: string;

  constructor(config: DashboardConfig) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
  }

  async registerEntry(
    discordId: string,
    username: string,
    fecha: string,
    horaEntrada: string,
    estado: string,
  ): Promise<void> {
    await this.post('/api/attendance/entrada', {
      discord_id: discordId,
      username,
      fecha,
      hora_entrada: horaEntrada,
      estado,
    });
  }

  async registerExit(
    discordId: string,
    fecha: string,
    horaSalida: string,
  ): Promise<void> {
    await this.post('/api/attendance/salida', {
      discord_id: discordId,
      fecha,
      hora_salida: horaSalida,
    });
  }

  private async post(
    path: string,
    body: Record<string, string>,
  ): Promise<void> {
    const response = await fetch(`${this.apiUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const responseBody = await response.text().catch(() => '');
      throw new Error(
        `Dashboard API ${path} respondió ${response.status}${
          responseBody ? `: ${responseBody}` : ''
        }`,
      );
    }

    logger.info(`Registro sincronizado con el dashboard (${path})`);
  }
}
