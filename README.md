# Strato Attendance Bot

Bot de Discord para registrar la asistencia de practicantes mediante comandos slash. Los registros se almacenan automáticamente en Google Sheets.

## Funcionalidades

- **`/asistencia entrada`** — Registra hora de entrada y estado de puntualidad.
- **`/asistencia salida`** — Registra hora de salida (requiere entrada previa del día).
- **`/asistencia estado`** — Consulta entrada, salida y estado del día actual.

### Reglas de negocio

| Regla | Valor por defecto |
|-------|-------------------|
| Ventana de registro de entrada | 07:00 – 14:00 |
| Puntualidad | Hasta la hora límite → **Puntual**, después → **Tardanza** |
| Zona horaria | `America/Mexico_City` (configurable) |

Los horarios se centralizan en `src/config/business.ts` y pueden ajustarse sin tocar la lógica de los servicios.

## Stack

- Node.js + TypeScript
- [discord.js](https://discord.js.org/) v14
- Google Sheets API (`googleapis`)
- dotenv

## Estructura del proyecto

```
src/
├── commands/          # Comandos slash de Discord
├── config/            # Variables de entorno, constantes y reglas de negocio
├── embeds/            # Embeds de respuesta al usuario
├── events/            # Eventos del cliente de Discord
├── handlers/          # Carga y enrutamiento de comandos
├── interfaces/        # Modelos del dominio (asistencia)
├── services/          # Lógica de negocio e integración con Sheets
├── types/             # Tipos auxiliares (Discord, etc.)
├── utils/             # Utilidades (fechas, errores, logger)
├── deploy-commands.ts # Registro de comandos en Discord
└── index.ts           # Punto de entrada
```

## Requisitos previos

- Node.js 18 o superior
- Una aplicación de bot en el [Discord Developer Portal](https://discord.com/developers/applications)
- Un proyecto en [Google Cloud](https://console.cloud.google.com/) con la API de Google Sheets habilitada
- Una hoja de cálculo de Google compartida con la cuenta de servicio

## Configuración

### 1. Discord

1. Crea una aplicación en el Developer Portal.
2. En **Bot**, genera un token y cópialo.
3. En **OAuth2 → URL Generator**, selecciona los scopes `bot` y `applications.commands`.
4. Invita el bot a tu servidor con permisos básicos.
5. Copia el **Application ID** (`DISCORD_CLIENT_ID`) y el **Server ID** (`DISCORD_GUILD_ID`, recomendado en desarrollo).

### 2. Google Sheets

1. Crea un proyecto en Google Cloud y habilita **Google Sheets API**.
2. Crea una **cuenta de servicio** y descarga el JSON de credenciales.
3. Crea una hoja de cálculo y compártela con el email de la cuenta de servicio (permiso **Editor**).
4. Copia el ID de la hoja desde la URL:
   `https://docs.google.com/spreadsheets/d/<GOOGLE_SHEETS_ID>/edit`

El bot crea automáticamente la pestaña `Asistencias` con estas columnas:

| discord_id | username | fecha | hora_entrada | hora_salida | estado |
|------------|----------|-------|--------------|-------------|--------|

El campo `estado` guarda **Puntual** o **Tardanza** al registrar la entrada.

### 3. Variables de entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env
```

Consulta `.env.example` para la lista completa de variables.

> **Importante:** Nunca subas el archivo `.env` a GitHub. Contiene credenciales sensibles.

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Registrar comandos slash (usar DISCORD_GUILD_ID para registro inmediato en un servidor)
npm run deploy-commands

# Desarrollo (recarga automática)
npm run dev

# Producción
npm run build
npm start
```

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el bot en modo desarrollo con `tsx watch` |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta el bot compilado |
| `npm run deploy-commands` | Publica los comandos slash en Discord |

## Solución de problemas

**Los comandos no aparecen en Discord**
- Ejecuta `npm run deploy-commands`.
- Si no usas `DISCORD_GUILD_ID`, los comandos globales pueden tardar hasta ~1 hora.

**Error al conectar con Discord (`Unexpected server response: 500`)**
- Verifica que `DISCORD_TOKEN` sea válido y no tenga espacios ni comillas extra.
- Cierra otras instancias del bot que usen el mismo token.
- Consulta el estado en [discordstatus.com](https://discordstatus.com).

**Error al escribir en Google Sheets**
- Confirma que la hoja esté compartida con la cuenta de servicio.
- Revisa que `GOOGLE_PRIVATE_KEY` conserve los saltos de línea (`\n`) en el `.env`.

## Licencia

[MIT](LICENSE)
