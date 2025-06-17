import { ApplicationCommandOptionChoiceData, AutocompleteFocusedOption, AutocompleteInteraction } from "discord.js";
import { IAutoCompleteHandler } from "./i-ac";
import { InjectionContainer } from "../../injection/injector";
import { ITEM_OPTIONS, itemOptions } from "../command-options/item-options";
import { IinventoryRepo, INVENTORY_REPO_KEY } from "../../repo/inventory/i-inventory-repo";
import { Inventory } from "../../models/inventory";
import { ItemInstance } from "../../models/item-instance";


export class ItemNameInventoryAutocomplete implements IAutoCompleteHandler {
    async handle(interaction: AutocompleteInteraction): Promise<void> {
        const focusedOption: AutocompleteFocusedOption = interaction.options.getFocused(true);
        const inventoryRepo: IinventoryRepo = new InjectionContainer().get<IinventoryRepo>(INVENTORY_REPO_KEY);
        const inventory: Inventory = await inventoryRepo.getInventoryByGuildUser(interaction.guild.id, interaction.user.id);
        let choices: ItemInstance[];
        if (focusedOption.name == itemOptions.getName(ITEM_OPTIONS.name)) {
            choices = await inventoryRepo.getInstancesAutocomplete(inventory.ID, focusedOption.value);
        }
        await interaction.respond(choices.map<ApplicationCommandOptionChoiceData>((instance) => {
            return { name: `${instance.itemRef.name} (x${instance.amount})`, value: instance.ID.toString() };
        }));
    }
}