import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CustomCommand } from "../../backend/models/custom-command";
import { SliderDialog } from "../../discord-gadgets/slider-dialog";
import { InjectionContainer } from "../../backend/injection/injector";
import { IitemRepo, ITEM_REPO_KEY } from "../../backend/repo/item/i-item-repo";
import { Item } from "../../backend/models/item";
import { EMBED_ITEM_FLAGS, EmbedItem } from "../../discord-gadgets/embed-item";

export = new CustomCommand(new SlashCommandBuilder()
    .setName('list_items')
    .setDescription('List all non secret items of this server.'),
    async (interaction) => {
        await interaction.deferReply();
        const repo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
        const maxDepth: number = await repo.getMaxDepth(interaction.guildId);
        const dialog = new SliderDialog<Item>(interaction, maxDepth, async (models) => {
            const embed = new EmbedBuilder().setTitle(`${interaction.guild.name}'s registered items.`)
                .setColor(0x755630)
                .setDescription(`All ${interaction.guild.name}'s public items.`)
                .addFields({ name: '\u200B', value: '\u200B' });
            models.forEach((item, key) => {
                embed.addFields({ name: `${key + 1}. ${item.name}`, value: `${item.resume}` });
                embed.addFields({ name: `T\$ ${item.value} | ${item.weight} slots.`, value: '\u200B' });
            });
            return embed;
        }, async (page) => await repo.getByDepth(interaction.guild.id, page), async (id) => {
            let updatedModel = await repo.getItem(id);
            return new EmbedItem(updatedModel).build(EMBED_ITEM_FLAGS.View);
        });
        await dialog.build();
    }, true);