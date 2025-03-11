import { ApplicationCommandOptionChoiceData, AutocompleteFocusedOption, AutocompleteInteraction } from "discord.js";
import { IAutoCompleteHandler } from "./i-ac";
import { InjectionContainer } from "../../injection/injector";
import { IitemRepo, ITEM_REPO_KEY } from "../../repo/item/i-item-repo";
import { ITEM_OPTIONS, itemOptions } from "../command-options/item-options";
import { Item } from "../../models/item";


export class ItemNameAutocomplete implements IAutoCompleteHandler {
    async handle(interaction: AutocompleteInteraction): Promise<void> {
        const focusedOption: AutocompleteFocusedOption = interaction.options.getFocused(true);
        const itemRepo: IitemRepo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
        let choices: Item[];
        if (focusedOption.name == itemOptions.getName(ITEM_OPTIONS.name)) {
            choices = await itemRepo.getFromAutocomplete(interaction.guildId, focusedOption.value);
        }
        await interaction.respond(choices.map<ApplicationCommandOptionChoiceData>((item) => {
            return { name: item.name, value: item.name };
        }));
    }
}