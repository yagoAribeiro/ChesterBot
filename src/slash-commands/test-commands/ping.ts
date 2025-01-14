import { SlashCommandBuilder } from 'discord.js';
import { CustomCommand } from '../../backend/models/custom-command';

export = new CustomCommand(new SlashCommandBuilder()
.setName('ping')
.setDescription('Replies with Pong!'), 	
async (interaction) => {
	await interaction.reply('Pong!');
}, true)
	

