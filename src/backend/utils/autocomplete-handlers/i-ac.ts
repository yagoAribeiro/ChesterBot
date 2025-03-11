import { AutocompleteInteraction } from "discord.js";

/**Base interface to classes that handle autocompletes. */
export interface IAutoCompleteHandler{
    handle(interaction: AutocompleteInteraction) : Promise<void>;
}