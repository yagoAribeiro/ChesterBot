import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CustomCommand } from "../../backend/models/custom-command";
import { SliderDialog } from "../../discord-gadgets/slider-dialog";
import { InjectionContainer } from "../../backend/injection/injector";
import { IitemRepo, ITEM_REPO_KEY } from "../../backend/repo/item/i-item-repo";

export = new CustomCommand(new SlashCommandBuilder()
    .setName('list_items')
    .setDescription('List all non secret items of this server.'),
    async (interaction) => {
        const repo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
        const dialog = new SliderDialog(interaction, async (embed: EmbedBuilder, page: number) => {
            const items = await repo.getByDepth(interaction.guildId, page);
            items.forEach((item, key) => {
                embed.addFields({ name: `${key+1}. ${item.name}`, value: `${item.resume}`});
                embed.addFields({name: `T\$ ${item.value} | ${item.weight} slots.`, value: '\u200B'});
            });
            return embed;
            }, 6);
        await dialog.build();
    }, true);