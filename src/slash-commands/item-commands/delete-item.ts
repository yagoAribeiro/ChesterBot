import { SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { CustomCommand } from "../../backend/models/custom-command";
import { ITEM_OPTIONS, itemOptions } from "../../backend/utils/command-options/item-options";
import { IitemRepo, ITEM_REPO_KEY } from "../../backend/repo/item/i-item-repo";
import { InjectionContainer } from "../../backend/injection/injector";
import { Item } from "../../backend/models/item";
import { EMBED_ITEM_FLAGS, EmbedItem } from "../../discord-gadgets/embed-item";
import { ConfirmationDialog } from "../../discord-gadgets/confirmation-dialog";
import { ItemNameAutocomplete } from "../../backend/utils/autocomplete-handlers/item-name-ac";
import { CommandException } from "../../backend/utils/command-exception";

export = new CustomCommand(new SlashCommandBuilder()
    .setName('delete_item')
    .setDescription('Delete an item from server.')
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.name, () => new SlashCommandStringOption().setRequired(true).setAutocomplete(true))),
    async (interaction) => {
        const itemRepo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
        const itemID: number = Number.parseInt(interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.name)));
        const dialog: ConfirmationDialog = new ConfirmationDialog((i: any) => i.user.id === interaction.user.id);
        let item: Item;
        let embed: EmbedItem;
        await interaction.deferReply();
        item = await itemRepo.getItem(itemID);
        if (!item) throw new CommandException(`❌ Chester couldn't find this item!`, interaction);
        embed = new EmbedItem(item);
        const response = await interaction.editReply({ content: `⚠️ Are you sure you want to delete **${item.name}** from your server and all inventories? `, components: [dialog.build()], embeds: [embed.build(EMBED_ITEM_FLAGS.Delete)] });
        await dialog.handle(response, async (_) => {
            await itemRepo.deleteItem(item.ID);
            await response.edit({ content: `✅ **${item.name}** was succesfully **deleted**!`, components: [] });
        }, async (confirmation) => {
            await response.delete();
        });
    }, true, new ItemNameAutocomplete().handle);