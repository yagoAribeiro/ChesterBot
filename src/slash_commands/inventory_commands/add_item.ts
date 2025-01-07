import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, Collection, CollectorFilter, SlashCommandBuilder } from 'discord.js';
import { CustomCommand } from '../../backend/models/custom_command';

export = new CustomCommand(new SlashCommandBuilder()
.setName('add_item')
.setDescription('Adds a new item to your Chester. Offers autocomplete for adding quantity to an item already stored.')
.addStringOption(opt => opt.setName('name').setDescription('Item\'s name.').setRequired(true).setMaxLength(256))
.addNumberOption(opt => opt.setName('quantity').setDescription('Item\'s quantity. Recommended to use ').setRequired(true))
.addStringOption(opt => opt.setName('description').setDescription('Item\'s description.').setRequired(false).setMaxLength(2048))
.addNumberOption(opt => opt.setName('weight').setDescription('Item\'s weight. Recommended to use Kilograms (kg), for conversion purposes.').setRequired(false))
.addNumberOption(opt => opt.setName('value').setDescription('Item\'s value. It can be any number to match your RPG currency.').setRequired(false))
.addBooleanOption(opt => opt.setName('equipable').setDescription('Set this item as an equipable item. For sorting purposes, and for allowing players to equip them.').setRequired(false)),
async (interaction) => {
    const item_name: string = interaction.options.getString('name');
    const item_description: string = interaction.options.getString('description');
    const item_weight: number = interaction.options.getNumber('weight');
    const item_quantity: number = interaction.options.getNumber('quantity');
    const item_value: number = interaction.options.getNumber('value');
    const item_equipable: boolean = interaction.options.getBoolean('equipable');
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
	const response = await interaction.reply({content: `Do you want to add **${item_name} x${Number.isInteger(item_quantity) ? item_quantity.toFixed(0) : item_quantity.toFixed(2)}**  to your Chester?`, components: [row_builder]});
    const filter = (i: any) => i.user.id === interaction.user.id;
    const confirmation: ButtonInteraction<CacheType> = (await response.awaitMessageComponent({filter: filter, time: 60_000})) as ButtonInteraction;
    if (confirmation.customId === 'confirm'){
        (await (await confirmation.update({content: `**${item_name} x${Number.isInteger(item_quantity) ? item_quantity.toFixed(0) : item_quantity.toFixed(2)}** has been ~~eated~~ added succesfully to your Chester!`, components: []})).fetch()).react('👅');
    }else if (confirmation.customId === 'cancel'){
        await confirmation.deferUpdate();
        await confirmation.deleteReply();
    }
   
}, true)
	

