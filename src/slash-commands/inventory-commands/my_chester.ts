import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CustomCommand } from "../../backend/models/custom-command";
import { SliderDialog } from "../../discord-gadgets/slider-dialog";
import { InjectionContainer } from "../../backend/injection/injector";
import { EMBED_ITEM_FLAGS } from "../../discord-gadgets/embed-item";
import { IinventoryRepo, INVENTORY_REPO_KEY } from "../../backend/repo/inventory/i-inventory-repo";
import { Inventory } from "../../backend/models/inventory";
import { ItemInstance } from "../../backend/models/item-instance";
import { EmbedInstance } from "../../discord-gadgets/embed-instance";
import { CommandException } from "../../backend/utils/command-exception";

export = new CustomCommand(new SlashCommandBuilder()
    .setName('my_chester')
    .setDescription('List all items inside your Chester.'),
    async (interaction) => {
        await interaction.deferReply();
        const repo = new InjectionContainer().get<IinventoryRepo>(INVENTORY_REPO_KEY);
        const inventory: Inventory = await repo.getInventoryByGuildUser(interaction.guild.id, interaction.user.id);
        if ((await repo.getItemCount(inventory.ID)) <= 0 )throw new CommandException('🥀 Your Chester is empty :(', interaction);
        const maxDepth: number = await repo.getMaxDepth(inventory.ID);
        const dialog = new SliderDialog<ItemInstance>(interaction, maxDepth, async (models) => {
            const embed = new EmbedBuilder().setTitle(`${interaction.user.displayName}'s registered items.`)
                .setColor(0x755630)
                .setThumbnail(interaction.user.avatarURL())
                .setAuthor({ name: `Summoned by ${interaction.user.displayName}`, iconURL: interaction.user.avatarURL() })
                .setDescription(`All the items that ${interaction.user.displayName}'s Chester ate.`)
                .addFields({ name: `Item value`, value: `T\$ ${(await repo.getTotalItemValue(inventory.ID)).toFixed(2)}`, inline: true })
                .addFields({ name: `Total weight`, value: `${(await repo.getTotalWeight(inventory.ID)).toFixed(2)} Slots`, inline: true })
                .addFields({ name: `Currency`, value: `T\$ ${inventory.currency ?? 'N/A'}`, inline: true })
                .addFields({ name: '\u200B', value: '\u200B' });
            models.forEach((instance, key) => {
                embed.addFields({ name: `${key + 1}. ${instance.itemRef.name} x${instance.amount}`, value: `${instance.itemRef.resume}` });
                embed.addFields({ name: `T\$ ${(instance.itemRef.value * instance.amount).toFixed(2)} | ${(instance.itemRef.weight * instance.amount).toFixed(2)} slots.`, value: '\u200B' });
            });

            return embed;
        }, async (page) => await repo.getInstancesByDepth(inventory.ID, page), async (id) => {
            let updatedModel = await repo.getInstance(id);
            return new EmbedInstance(updatedModel).build(interaction.user.displayName);
        });
        await dialog.build().catch(err => console.log(err));
    }, true);