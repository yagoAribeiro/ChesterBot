import { InteractionResponse, SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption, SlashCommandUserOption, User } from 'discord.js';
import { CustomCommand } from '../../backend/models/custom-command';
import { InjectionContainer } from '../../backend/injection/injector';
import { itemOptions, ITEM_OPTIONS } from '../../backend/utils/command-options/item-options';
import { IinventoryRepo, INVENTORY_REPO_KEY } from '../../backend/repo/inventory/i-inventory-repo';
import { Inventory } from '../../backend/models/inventory';
import { ItemNameAutocomplete } from '../../backend/utils/autocomplete-handlers/item-name-ac';
import { CommandException } from '../../backend/utils/command-exception';
import { INVENTORY_OPTIONS, inventoryOptions } from '../../backend/utils/command-options/inventory-options';
export = new CustomCommand(new SlashCommandBuilder()
    .setName('update_inventory')
    .setDescription('Update an user\'s inventory.')
    .addUserOption(inventoryOptions.getCommandOption(INVENTORY_OPTIONS.user, () => new SlashCommandUserOption().setRequired(true)))
    .addNumberOption(inventoryOptions.getCommandOption(INVENTORY_OPTIONS.currency, () => new SlashCommandNumberOption().setRequired(false)))
    .addNumberOption(inventoryOptions.getCommandOption(INVENTORY_OPTIONS.max_weight, () => new SlashCommandNumberOption().setRequired(false).setMinValue(0))),
    async (interaction) => {
        const user: User = interaction.options.getUser(inventoryOptions.getName(INVENTORY_OPTIONS.user));
        const currency: number | null = interaction.options.getNumber(inventoryOptions.getName(INVENTORY_OPTIONS.currency));
        const maxWeight: number | null = interaction.options.getNumber(inventoryOptions.getName(INVENTORY_OPTIONS.max_weight));
        const inventoryRepo: IinventoryRepo = new InjectionContainer().get<IinventoryRepo>(INVENTORY_REPO_KEY);
        let response: InteractionResponse = await interaction.deferReply();
        let inventory: Inventory = await inventoryRepo.getInventoryByGuildUser(interaction.guildId, user.id);
        try {
            await inventoryRepo.update(inventory.ID, currency, maxWeight);
            await interaction.editReply({ content: `✅ **${user.displayName}**'s inventory was succesfully updated.`, components: [] });
            (await (response.fetch())).react('👅');
            
        } catch (err) {
            throw new CommandException(err.message, interaction);
        }
    }, true, new ItemNameAutocomplete().handle);


