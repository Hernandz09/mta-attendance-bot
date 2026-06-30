import { google, sheets_v4 } from 'googleapis';
import { GoogleConfig } from '../config/google';
import {
  GOOGLE_SHEETS_SCOPE,
  SHEET_DATA_RANGE,
  SHEET_HEADER_RANGE,
  SHEET_HEADERS,
  SHEET_NAME,
} from '../config/constants';
import { AttendanceRecord } from '../interfaces/attendance.interface';

export class SheetsService {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;

  constructor(config: GoogleConfig) {
    const auth = new google.auth.JWT({
      email: config.serviceAccountEmail,
      key: config.privateKey,
      scopes: [GOOGLE_SHEETS_SCOPE],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = config.sheetsId;
  }

  async ensureSheetExists(): Promise<void> {
    const spreadsheet = await this.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
    });

    const sheet = spreadsheet.data.sheets?.find(
      (s) => s.properties?.title === SHEET_NAME,
    );

    if (!sheet) {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: SHEET_NAME },
              },
            },
          ],
        },
      });
    }

    const headerResponse = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: SHEET_HEADER_RANGE,
    });

    const existingHeaders = headerResponse.data.values?.[0] ?? [];

    if (existingHeaders.length === 0) {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: SHEET_HEADER_RANGE,
        valueInputOption: 'RAW',
        requestBody: {
          values: [SHEET_HEADERS as unknown as string[]],
        },
      });
    }
  }

  async findTodayRecord(
    discordId: string,
    date: string,
  ): Promise<AttendanceRecord | null> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: SHEET_DATA_RANGE,
    });

    const rows = response.data.values ?? [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const [rowDiscordId, username, rowDate, entryTime, exitTime, status] =
        row;

      if (rowDiscordId === discordId && rowDate === date) {
        return {
          rowIndex: i + 1,
          discordId: rowDiscordId,
          username: username ?? '',
          date: rowDate,
          entryTime: entryTime ?? '',
          exitTime: exitTime ?? '',
          status: status ?? '',
        };
      }
    }

    return null;
  }

  async appendEntry(
    discordId: string,
    username: string,
    date: string,
    entryTime: string,
    status: string,
  ): Promise<void> {
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: SHEET_DATA_RANGE,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[discordId, username, date, entryTime, '', status]],
      },
    });
  }

  async updateExit(rowIndex: number, exitTime: string): Promise<void> {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${SHEET_NAME}!E${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[exitTime]],
      },
    });
  }
}
