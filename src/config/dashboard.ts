/**
 * Configuración opcional del API del dashboard interno.
 * Si falta alguna de las dos variables, el sync queda desactivado
 * y el bot solo escribe en Google Sheets.
 */
export interface DashboardConfig {
  apiUrl: string;
  apiKey: string;
}

export function loadDashboardConfig(): DashboardConfig | undefined {
  const apiUrl = process.env.DASHBOARD_API_URL?.trim();
  const apiKey = process.env.ATTENDANCE_BOT_API_KEY?.trim();

  if (!apiUrl && !apiKey) {
    return undefined;
  }

  if (!apiUrl || !apiKey) {
    throw new Error(
      'Configuración incompleta del dashboard: define DASHBOARD_API_URL y ATTENDANCE_BOT_API_KEY, o ninguna de las dos.',
    );
  }

  return {
    apiUrl: apiUrl.replace(/\/+$/, ''),
    apiKey,
  };
}
