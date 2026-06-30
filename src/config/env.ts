import { resolveBusinessTimezone } from './business';
import { DiscordConfig, loadDiscordConfig } from './discord';
import { GoogleConfig, loadGoogleConfig } from './google';

export interface AppConfig {
  discord: DiscordConfig;
  google: GoogleConfig;
  timezone: string;
}

export function loadConfig(): AppConfig {
  return {
    discord: loadDiscordConfig(),
    google: loadGoogleConfig(),
    timezone: resolveBusinessTimezone(process.env.TIMEZONE),
  };
}
