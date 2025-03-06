import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';

/**
 * Base command object to be loaded by command loader and to handle it's requests.
 */
export class CustomCommand{
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    devOnly: boolean;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;

    constructor(data: typeof this.data, execute: (interaction: ChatInputCommandInteraction) => Promise<void>, devOnly?: boolean, autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>){
        this.data = data;
        this.execute = execute;
        this.devOnly = devOnly ?? false;
        this.autocomplete = autocomplete;
    }
}
