import { tagged } from 'brandi';
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';
import { TAGS } from '../injection/tokens';

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

tagged(CustomCommand, TAGS.tests);