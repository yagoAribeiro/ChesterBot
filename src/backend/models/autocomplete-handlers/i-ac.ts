import { AutocompleteInteraction } from "discord.js";


export interface IAutoCompleteHandler{
    handle(interaction: AutocompleteInteraction) : Promise<void>;
}