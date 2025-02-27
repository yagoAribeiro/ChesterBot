import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';

export class CustomCommand{
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    devOnly: boolean;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;

    constructor(data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder , execute: (interaction: ChatInputCommandInteraction) => Promise<void>, devOnly?: boolean, autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>){
        this.data = data;
        this.execute = execute;
        this.devOnly = devOnly ?? false;
        this.autocomplete = autocomplete;
    }
}
