import { EmbedBuilder, SlashCommandBuilder, SlashCommandUserOption, User } from "discord.js";
import { CustomCommand } from "../../backend/models/custom-command";
import { SliderDialog } from "../../discord-gadgets/slider-dialog";
import { InjectionContainer } from "../../backend/injection/injector";
import { IinventoryRepo, INVENTORY_REPO_KEY } from "../../backend/repo/inventory/i-inventory-repo";
import { Inventory } from "../../backend/models/inventory";
import { ItemInstance } from "../../backend/models/item-instance";
import { EmbedInstance } from "../../discord-gadgets/embed-instance";
import { CommandException } from "../../backend/utils/command-exception";
import { INVENTORY_OPTIONS, inventoryOptions } from "../../backend/utils/command-options/inventory-options";

export = new CustomCommand(new SlashCommandBuilder()
    .setName('check_chester')
    .addUserOption(inventoryOptions.getCommandOption(INVENTORY_OPTIONS.user, () => new SlashCommandUserOption()).setRequired(true))
    .setDescription('List all items inside another user\'s Chester.'),
    async (interaction) => {
        await interaction.deferReply();
        const repo = new InjectionContainer().get<IinventoryRepo>(INVENTORY_REPO_KEY);
        const user: User = interaction.options.getUser(inventoryOptions.getName(INVENTORY_OPTIONS.user));
        const inventory: Inventory = await repo.getInventoryByGuildUser(interaction.guild.id, user.id);
        if ((await repo.getItemCount(inventory.ID)) <= 0 )throw new CommandException('🥀 Your Chester is empty :(', interaction);
        const maxDepth: number = await repo.getMaxDepth(inventory.ID);
        const dialog = new SliderDialog<ItemInstance>(interaction, maxDepth, async (models) => {
            const embed = new EmbedBuilder().setTitle(`${user.displayName}'s registered items.`)
                .setColor(0x755630)
                .setThumbnail(user.avatarURL())
                .setAuthor({ name: `Summoned by ${interaction.user.displayName}`, iconURL: interaction.user.avatarURL() })
                .setDescription(`All the items that ${user.displayName}'s Chester ate.`)
                .addFields({ name: `Item value`, value: `T\$ ${(await repo.getTotalItemValue(inventory.ID)).toFixed(2)}`, inline: true })
                .addFields({ name: `Total weight`, value: `${(await repo.getTotalWeight(inventory.ID)).toFixed(2)}${inventory.maxWeight ? ' / '+ inventory.maxWeight.toFixed(2) : ''} Slots`, inline: true })
                .addFields({ name: `Currency`, value: `T\$ ${inventory.currency ?? 'N/A'}`, inline: true })
                .addFields({ name: '\u200B', value: '\u200B' });
            models.forEach((instance, key) => {
                embed.addFields({ name: `${key + 1}. ${instance.itemRef.name} x${instance.amount}`, value: `${instance.itemRef.resume}` });
                embed.addFields({ name: `T\$ ${(instance.itemRef.value * instance.amount).toFixed(2)} | ${(instance.itemRef.weight * instance.amount).toFixed(2)} slots.`, value: '\u200B' });
            });

            return embed;
        }, async (page) => await repo.getInstancesByDepth(inventory.ID, page), async (id) => {
            let updatedModel = await repo.getInstance(id);
            return new EmbedInstance(updatedModel).build(user.displayName);
        });
        await dialog.build().catch(err => console.log(err));
    }, true);