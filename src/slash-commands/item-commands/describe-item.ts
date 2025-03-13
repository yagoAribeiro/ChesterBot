import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { CustomCommand } from '../../backend/models/custom-command';
import { Item } from '../../backend/models/item';
import { InjectionContainer } from '../../backend/injection/injector';
import { IitemRepo, ITEM_REPO_KEY } from '../../backend/repo/item/i-item-repo';
import { itemOptions, ITEM_OPTIONS } from '../../backend/utils/command-options/item-options';
import { EMBED_ITEM_FLAGS, EmbedItem } from '../../discord-gadgets/embed-item';
import { ItemNameAutocomplete } from '../../backend/utils/autocomplete-handlers/item-name-ac';

export = new CustomCommand(new SlashCommandBuilder()
    .setName('describe_item')
    .setDescription('Describe a global item.')
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.name, () => new SlashCommandStringOption().setRequired(true).setAutocomplete(true))),
    async (interaction) => {
        const itemRepo: IitemRepo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
        const name: string = interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.name));
        let item: Item;
        let embed: EmbedItem;
        await interaction.deferReply();
        item = await itemRepo.getItemByName(interaction.guildId, name);
        embed = new EmbedItem(item);
        await interaction.editReply(({embeds: [embed.build(EMBED_ITEM_FLAGS.View)] }));
    }, true, async (interaction) => new ItemNameAutocomplete().handle(interaction));
