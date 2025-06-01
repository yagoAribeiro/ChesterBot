import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption } from 'discord.js';
import { CustomCommand } from '../../backend/models/custom-command';
import { Item } from '../../backend/models/item';
import { InjectionContainer } from '../../backend/injection/injector';
import { IitemRepo, ITEM_REPO_KEY } from '../../backend/repo/item/i-item-repo';
import { itemOptions, ITEM_OPTIONS } from '../../backend/utils/command-options/item-options';
import { EMBED_ITEM_FLAGS, EmbedItem } from '../../discord-gadgets/embed-item';
import { ConfirmationDialog } from '../../discord-gadgets/confirmation-dialog';
import { ItemNameAutocomplete } from '../../backend/utils/autocomplete-handlers/item-name-ac';
import { CommandException } from '../../backend/utils/command-exception';
import { ItemNameSecretsAutocomplete } from '../../backend/utils/autocomplete-handlers/item-name-secrets-ac';
export = new CustomCommand(new SlashCommandBuilder()
    .setName('update_any_item')
    .setDescription('Update an current existing item. Including secrets.')
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.name, () => new SlashCommandStringOption().setRequired(true).setAutocomplete(true)))
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.new_name, () => new SlashCommandStringOption().setRequired(false)))
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.resume, () => new SlashCommandStringOption().setRequired(false)))
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.description, () => new SlashCommandStringOption().setRequired(false)))
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.effect, () => new SlashCommandStringOption().setRequired(false)))
    .addNumberOption(itemOptions.getCommandOption(ITEM_OPTIONS.value, () => new SlashCommandNumberOption().setRequired(false)))
    .addNumberOption(itemOptions.getCommandOption(ITEM_OPTIONS.weight, () => new SlashCommandNumberOption().setRequired(false)))
    .addBooleanOption(itemOptions.getCommandOption(ITEM_OPTIONS.secret, () => new SlashCommandBooleanOption().setRequired(false))),
    async (interaction) => {
        const itemRepo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
        const itemID: number = Number.parseInt(interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.name)));
        await interaction.deferReply();
        let oldItem: Item = await itemRepo.getItem(itemID);
        if (!oldItem) throw new CommandException(`❌ Chester couldn't find this item!`, interaction);
        let newItem: Item = new Item(oldItem.guildID,
            interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.new_name)) ?? oldItem.name,
            interaction.options.getBoolean(itemOptions.getName(ITEM_OPTIONS.secret)) ?? oldItem.secret,
            new Date(),
            interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.description)) ?? oldItem.description,
            interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.resume)) ?? oldItem.resume,
            interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.effect)) ?? oldItem.effect,
            interaction.options.getNumber(itemOptions.getName(ITEM_OPTIONS.weight)) ?? oldItem.weight,
            interaction.options.getNumber(itemOptions.getName(ITEM_OPTIONS.value)) ?? oldItem.value, oldItem.guildRef, oldItem.ID);

        const dialog: ConfirmationDialog = new ConfirmationDialog((i: any) => i.user.id === interaction.user.id);
        const embedOld: EmbedItem = new EmbedItem(oldItem);
        const embedNew: EmbedItem = new EmbedItem(newItem);
        const response = await interaction.editReply({ content: `Do you want to update **${oldItem.name}**?`, components: [dialog.build()], embeds: [embedOld.build(EMBED_ITEM_FLAGS.Delete), embedNew.build(EMBED_ITEM_FLAGS.Create)] });
        await dialog.handle(response, async (_) => {
            await itemRepo.updateItem(itemID, newItem);
            await response.edit({ content: `✅ **${oldItem.name}** was succesfully updated.`, components: [] });
            (await response.fetch()).react('👅');
        }, async (confirmation) => {
            await response.delete();
        });

    }, true, new ItemNameSecretsAutocomplete().handle);


