/**
 * Chester is a personal and communitary open source project.
 * Note that all the code in this project is written by me, but not all ideas are mine.
 * You are free to use, distribute, or base your own needs on this code, as long as you also distribute
 * the LICENSE file. Follow the guides accordingly to MIT license.
 * 
 * If you find any problems, please, open an issue at https://github.com/yagoAribeiro/ChesterBot/issues;
 */


import { Client, REST, Events, GatewayIntentBits } from 'discord.js';
import { SlashCommandLoader } from './bin/backend/utils/command-loader.js';
import { resolve, join } from 'node:path';
import { AppConfig } from './bin/backend/utils/app-config.js';
import { setEntries } from './bin/backend/injection/container.js';
import { InjectionContainer } from './bin/backend/injection/injector.js';
import { ItemAPI } from './bin/backend/api/item/item-api.js';
import { ItemTestRepo } from './bin/backend/repo/item/item-repo-test.js';
import { ItemRepo } from './bin/backend/repo/item/item-repo.js';
import { CommandException } from './bin/backend/utils/command-exception.js';

const __dirname = resolve();
const __dircommand = 'bin/slash-commands';

//DI
setEntries([AppConfig, ItemAPI, ItemRepo, ItemTestRepo])
const config = new InjectionContainer().get('AppConfig');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent, GatewayIntentBits.GuildIntegrations]
});

//Client setup base;
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const rest = new REST().setToken(config.token);


//Command registering base;
const commandLoader = new SlashCommandLoader(join(__dirname, __dircommand));
commandLoader.setup(rest, config.clientID).then((value) => client.commands = value);

//Command handling base;
client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isCommand) {
		const command = interaction.client.commands.get(interaction.commandName);
		try {
			if (interaction.isChatInputCommand()) {
				await command.execute(interaction);
			} else if (interaction.isAutocomplete()) {
				await command.autocomplete(interaction);
			}
		} catch (err) {
			if (err instanceof CommandException){
				if (err.commandInteraction != null){
					try{
						if (err.commandInteraction.replied || err.commandInteraction.deferred) await err.commandInteraction.editReply({content: err.message, components: [], embeds: []});
						else await err.commandInteraction.reply({content: err.message, components: [], embeds: []});
					}catch(e){
						console.error(`Could not properly reply to a command exception: ${e}`);
					}
				}
			}
			else console.error(err);
		}
	}

});

config.discordClient = client;
client.login(config.token);
