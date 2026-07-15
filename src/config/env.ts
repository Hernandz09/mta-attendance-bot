import { resolveBusinessTimezone } from './business';
import { DashboardConfig, loadDashboardConfig } from './dashboard';
import { DiscordConfig, loadDiscordConfig } from './discord';
import { GoogleConfig, loadGoogleConfig } from './google';

export interface AppConfig {
  discord: DiscordConfig;
  google: GoogleConfig;
  dashboard?: DashboardConfig;
  timezone: string;
}

export function loadConfig(): AppConfig {
  return {
    discord: loadDiscordConfig(),
    google: loadGoogleConfig(),
    dashboard: loadDashboardConfig(),
    timezone: resolveBusinessTimezone(process.env.TIMEZONE),
  };
}
