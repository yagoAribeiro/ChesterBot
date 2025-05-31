import { EmbedBuilder, Guild, SlashCommandBuilder } from "discord.js";
import { CustomCommand } from "../../backend/models/custom-command";
import { SliderDialog } from "../../discord-gadgets/slider-dialog";
import { InjectionContainer } from "../../backend/injection/injector";
import { IitemRepo, ITEM_REPO_KEY } from "../../backend/repo/item/i-item-repo";
import { Item } from "../../backend/models/item";
import { EMBED_ITEM_FLAGS, EmbedItem } from "../../discord-gadgets/embed-item";
import { GUILD_REPO_KEY, IGuildRepo } from "../../backend/repo/guild/i-guild-repo";
import { GuildModel } from "../../backend/models/guild";

export = new CustomCommand(new SlashCommandBuilder()
    .setName('list_items')
    .setDescription('List all non secret items of this server.')
    .addStringOption(option =>
        option.setName('sorting')
            .setDescription(`Sort the list of items, accordingly to its alphanumerical name.`)
            .setRequired(true)
            .addChoices(
                { name: 'Ascending', value: '0' },
                { name: 'Descending', value: '1' },
            )),
    async (interaction) => {
        await interaction.deferReply();
        const repo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
        const guildRepo = new InjectionContainer().get<IGuildRepo>(GUILD_REPO_KEY);
        let guild: GuildModel = await guildRepo.getGuildByDiscordID(interaction.guild.id);
        let maxDepth: number = await repo.getMaxDepth(guild.ID);
        let dialog = new SliderDialog<Item>(interaction, maxDepth, async (models) => {
            const embed = new EmbedBuilder().setTitle(`${interaction.guild.name}'s registered items.`)
                .setColor(0x755630)
                .setThumbnail(interaction.guild.iconURL())
                .setAuthor({ name: `Summoned by ${interaction.user.globalName}`, iconURL: interaction.user.avatarURL() })
                .setDescription(`All ${interaction.guild.name}'s public items.`)
                .addFields({ name: '\u200B', value: '\u200B' });
            models.forEach((item, key) => {
                embed.addFields({ name: `${key + 1}. ${item.name}`, value: `${item.resume}` });
                embed.addFields({ name: `T\$ ${item.value} | ${item.weight} slots.`, value: '\u200B' });
            });
            return embed;
        }, async (page) => await repo.getItemsByDepth(interaction.guild.id, page, Number.parseInt(interaction.options.getString('sorting'))), async (id) => {
            let updatedModel = await repo.getItem(id);
            return new EmbedItem(updatedModel).build(EMBED_ITEM_FLAGS.View);
        });
        await dialog.build().catch(err => console.log(err));
    }, true);