import { InteractionResponse, SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption, SlashCommandUserOption, User } from 'discord.js';
import { CustomCommand } from '../../backend/models/custom-command';
import { InjectionContainer } from '../../backend/injection/injector';
import { itemOptions, ITEM_OPTIONS } from '../../backend/utils/command-options/item-options';
import { IinventoryRepo, INVENTORY_REPO_KEY } from '../../backend/repo/inventory/i-inventory-repo';
import { Inventory } from '../../backend/models/inventory';
import { ItemNameAutocomplete } from '../../backend/utils/autocomplete-handlers/item-name-ac';
import { Item } from '../../backend/models/item';
import { CommandException } from '../../backend/utils/command-exception';
import { INVENTORY_OPTIONS, inventoryOptions } from '../../backend/utils/command-options/inventory-options';
export = new CustomCommand(new SlashCommandBuilder()
    .setName('add_to')
    .setDescription('Add an item to another user\'s inventory.')
    .addUserOption(inventoryOptions.getCommandOption(INVENTORY_OPTIONS.user, () => new SlashCommandUserOption()).setRequired(true))
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.name, () => new SlashCommandStringOption().setRequired(true).setAutocomplete(true)))
    .addNumberOption(itemOptions.getCommandOption(ITEM_OPTIONS.quantity, () => new SlashCommandNumberOption().setRequired(false))),
    async (interaction) => {
        const inventoryRepo = new InjectionContainer().get<IinventoryRepo>(INVENTORY_REPO_KEY);
        const user: User = interaction.options.getUser(inventoryOptions.getName(INVENTORY_OPTIONS.user));
        const itemID: number = Number.parseInt(interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.name)));
        const quantity: number = interaction.options.getNumber(itemOptions.getName(ITEM_OPTIONS.quantity)) ?? 1;
        let response: InteractionResponse = await interaction.deferReply();
        let inventory: Inventory = await inventoryRepo.getInventoryByGuildUser(interaction.guildId, user.id);
        try {
            let itemRef: Item = await inventoryRepo.add(itemID, inventory.ID, quantity);
            if (itemRef) {
                await interaction.editReply({ content: `✅ **${itemRef.name} x${quantity}** was succesfully added to **${user.displayName}**'s Chester!`, components: [] });
                (await (response.fetch())).react('👅');
            }
        } catch (err) {
            throw new CommandException(err.message, interaction);
        }
    }, true, new ItemNameAutocomplete().handle);


