import { InteractionResponse, SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption } from 'discord.js';
import { CustomCommand } from '../../backend/models/custom-command';
import { InjectionContainer } from '../../backend/injection/injector';
import { itemOptions, ITEM_OPTIONS } from '../../backend/utils/command-options/item-options';
import { IinventoryRepo, INVENTORY_REPO_KEY } from '../../backend/repo/inventory/i-inventory-repo';
import { Item } from '../../backend/models/item';
import { ItemNameInventoryAutocomplete } from '../../backend/utils/autocomplete-handlers/item-name-inventory-ac';
import { CommandException } from '../../backend/utils/command-exception';
export = new CustomCommand(new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a stack or an amount of an item from your inventory.')
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.name, () => new SlashCommandStringOption().setRequired(true).setAutocomplete(true)))
    .addNumberOption(itemOptions.getCommandOption(ITEM_OPTIONS.quantity, () => new SlashCommandNumberOption().setRequired(false))),
    async (interaction) => {
        const inventoryRepo = new InjectionContainer().get<IinventoryRepo>(INVENTORY_REPO_KEY);
        const instanceID: number = Number.parseInt(interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.name)));
        const quantity: number | null = interaction.options.getNumber(itemOptions.getName(ITEM_OPTIONS.quantity));
        let response: InteractionResponse = await interaction.deferReply();
        try {
             let itemRef: Item = await inventoryRepo.remove(instanceID, quantity);
            if (itemRef) {
                await interaction.editReply({ content: `✅ **${itemRef.name} x${quantity ?? '(All)'}** was succesfully removed from your Chester!`, components: [] });
                (await (response.fetch())).react('🥀');
            }
        } catch (err) {
            throw new CommandException(err.message, interaction);
        }
    }, true, new ItemNameInventoryAutocomplete().handle);


