import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption } from 'discord.js';
import { CustomCommand } from '../../backend/models/custom-command';
import { Item } from '../../backend/models/item';
import { InjectionContainer } from '../../backend/injection/injector';
import { IitemRepo, ITEM_REPO_KEY } from '../../backend/repo/item/i-item-repo';
import { itemOptions, ITEM_OPTIONS } from '../../backend/models/command-options/item-options';

export = new CustomCommand(new SlashCommandBuilder()
.setName('create_item')
.setDescription('Create a new item to current server.')
.addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.name, () => new SlashCommandStringOption().setRequired(true)))
.addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.description, () => new SlashCommandStringOption().setRequired(false)))
.addNumberOption(itemOptions.getCommandOption(ITEM_OPTIONS.value, () => new SlashCommandNumberOption().setRequired(false)))
.addNumberOption(itemOptions.getCommandOption(ITEM_OPTIONS.weight, () => new SlashCommandNumberOption().setRequired(false)))
.addBooleanOption(itemOptions.getCommandOption(ITEM_OPTIONS.secret, () => new SlashCommandBooleanOption().setRequired(false))),
async (interaction) => {
    const itemRepo = InjectionContainer.get<IitemRepo>(ITEM_REPO_KEY);
    let newItem: Item = new Item(interaction.guildId, 
      interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.name)),
      interaction.options.getBoolean(itemOptions.getName(ITEM_OPTIONS.secret)),
      new Date(),
      interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.description)),
      interaction.options.getNumber(itemOptions.getName(ITEM_OPTIONS.weight)),
      interaction.options.getNumber(itemOptions.getName(ITEM_OPTIONS.value)));
    const btnConfirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Yes')
            .setEmoji('✅')
			.setStyle(ButtonStyle.Success);
	const btnCancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
            .setEmoji('❌')
			.setStyle(ButtonStyle.Danger);
    const rowBuilder: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents([btnConfirm, btnCancel]);
	const response = await interaction.reply({content: `Do you want to create **${newItem.name}** and register it in your server? `, components: [rowBuilder]});
    const filter = (i: any) => i.user.id === interaction.user.id;
    const confirmation: ButtonInteraction<CacheType> = (await response.awaitMessageComponent({filter: filter, time: 60_000})) as ButtonInteraction;
    if (confirmation.customId === 'confirm'){
        await itemRepo.addItem(newItem);
        (await (await confirmation.update({content: `**${newItem.name}** was succesfully created.`, components: []})).fetch()).react('👅');
    }else if (confirmation.customId === 'cancel'){
        await confirmation.deferUpdate();
        await confirmation.deleteReply();
    }
   
}, true)
	

