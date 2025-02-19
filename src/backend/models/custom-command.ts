import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';

export class CustomCommand{
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    devOnly: boolean;

    constructor(data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder , execute: (interaction: ChatInputCommandInteraction) => Promise<void>, devOnly: boolean | null){
        this.data = data;
        this.execute = execute;
        this.devOnly = devOnly ?? false;
    }
}
