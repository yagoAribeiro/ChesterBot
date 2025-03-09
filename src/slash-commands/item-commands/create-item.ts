import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption } from 'discord.js';
import { CustomCommand } from '../../backend/models/custom-command';
import { Item } from '../../backend/models/item';
import { InjectionContainer } from '../../backend/injection/injector';
import { IitemRepo, ITEM_REPO_KEY } from '../../backend/repo/item/i-item-repo';
import { itemOptions, ITEM_OPTIONS } from '../../backend/models/command-options/item-options';
import { EMBED_ITEM_FLAGS, EmbedItem } from '../../discord-gadgets/embed-item';
import { ConfirmationDialog } from '../../discord-gadgets/confirmation-dialog';
export = new CustomCommand(new SlashCommandBuilder()
    .setName('create_item')
    .setDescription('Create a new item to current server.')
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.name, () => new SlashCommandStringOption().setRequired(true)))
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.resume, () => new SlashCommandStringOption().setRequired(false)))
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.description, () => new SlashCommandStringOption().setRequired(false)))
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.effect, () => new SlashCommandStringOption().setRequired(false)))
    .addNumberOption(itemOptions.getCommandOption(ITEM_OPTIONS.value, () => new SlashCommandNumberOption().setRequired(false)))
    .addNumberOption(itemOptions.getCommandOption(ITEM_OPTIONS.weight, () => new SlashCommandNumberOption().setRequired(false)))
    .addBooleanOption(itemOptions.getCommandOption(ITEM_OPTIONS.secret, () => new SlashCommandBooleanOption().setRequired(false))),
    async (interaction) => {
        const itemRepo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
        let newItem: Item = new Item(interaction.guildId,
            interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.name)),
            interaction.options.getBoolean(itemOptions.getName(ITEM_OPTIONS.secret)),
            new Date(),
            interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.description)),
            interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.resume)),
            interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.effect)),
            interaction.options.getNumber(itemOptions.getName(ITEM_OPTIONS.weight)),
            interaction.options.getNumber(itemOptions.getName(ITEM_OPTIONS.value)));
        const dialog: ConfirmationDialog = new ConfirmationDialog((i: any) => i.user.id === interaction.user.id);
        const embed: EmbedItem = new EmbedItem(newItem);
        const response = await interaction.reply({ content: `Do you want to create **${newItem.name}** and register it in your server? `, components: [dialog.build()], embeds: [embed.build(EMBED_ITEM_FLAGS.Create)] });
        await dialog.handle(response, async (_) => {
            await itemRepo.addItem(newItem);
            await response.edit({ content: `✅ **${newItem.name}** was succesfully created.`,  components: [] });
            (await response.fetch()).react('👅');
        }, async (confirmation) => {
            await confirmation.deferUpdate();
            await confirmation.deleteReply();
        });

    }, true);


