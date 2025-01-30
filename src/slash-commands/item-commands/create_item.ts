import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, SlashCommandBuilder } from 'discord.js';
import { CustomCommand } from '../../backend/models/custom-command';
import { CONTAINER } from '../../backend/injection/container';
import { TOKENS } from '../../backend/injection/tokens';
import { Item } from '../../backend/models/item';

export = new CustomCommand(new SlashCommandBuilder()
.setName('create_item')
.setDescription('Create a new item to current server.')
.addStringOption(opt => opt.setName('name').setDescription('Item\'s name.').setRequired(true).setMaxLength(256))
.addStringOption(opt => opt.setName('description').setDescription('Item\'s description.').setRequired(false).setMaxLength(2048))
.addNumberOption(opt => opt.setName('weight').setDescription('Item\'s weight. Recommended to use Kilograms (kg), for conversion purposes.').setRequired(false))
.addNumberOption(opt => opt.setName('value').setDescription('Item\'s value. It can be any number to match your RPG currency.').setRequired(false))
.addBooleanOption(opt => opt.setName('equipable').setDescription('Set this item as an equipable item. For sorting purposes, and for allowing players to equip them.').setRequired(false)),
async (interaction) => {
    let new_item: Item = new Item(interaction.guildId, interaction.options.getString('name'),  interaction.options.getBoolean('equipable'), new Date(), interaction.options.getString('description'), interaction.options.getNumber('weight'), interaction.options.getNumber('value'));
    const btn_confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Yes')
            .setEmoji('✅')
			.setStyle(ButtonStyle.Success);
	const btn_cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
            .setEmoji('❌')
			.setStyle(ButtonStyle.Danger);
    const row_builder: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents([btn_confirm, btn_cancel]);
	const response = await interaction.reply({content: `Do you want to create **${new_item.name}** and register it in your server? `, components: [row_builder]});
    const filter = (i: any) => i.user.id === interaction.user.id;
    const confirmation: ButtonInteraction<CacheType> = (await response.awaitMessageComponent({filter: filter, time: 60_000})) as ButtonInteraction;
    if (confirmation.customId === 'confirm'){
        await CONTAINER.get(TOKENS.itemRepo).addItem(new_item);
        (await (await confirmation.update({content: `**${new_item.name}** was succesfully created.`, components: []})).fetch()).react('👅');
    }else if (confirmation.customId === 'cancel'){
        await confirmation.deferUpdate();
        await confirmation.deleteReply();
    }
   
}, true)
	

