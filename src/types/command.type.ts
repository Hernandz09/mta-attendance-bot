import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import { AttendanceService } from '../services/attendanceService';

export type SlashCommandData =
  | SlashCommandBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | SlashCommandOptionsOnlyBuilder
  | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

export interface BotCommand {
  data: SlashCommandData;
  execute: (
    interaction: ChatInputCommandInteraction,
    attendanceService: AttendanceService,
  ) => Promise<void>;
}
