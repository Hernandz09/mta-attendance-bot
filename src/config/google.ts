function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variable de entorno requerida: ${key}`);
  }
  return value;
}

export interface GoogleConfig {
  sheetsId: string;
  serviceAccountEmail: string;
  privateKey: string;
}

export function loadGoogleConfig(): GoogleConfig {
  return {
    sheetsId: requireEnv('GOOGLE_SHEETS_ID').trim(),
    serviceAccountEmail: requireEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL').trim(),
    privateKey: requireEnv('GOOGLE_PRIVATE_KEY').trim().replace(/\\n/g, '\n'),
  };
}
