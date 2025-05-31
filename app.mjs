/**
 * Check the LICENSE file before any modifications or use of this code.
 * 
 * If you find any problems, please, open an issue at https://github.com/yagoAribeiro/ChesterBot/issues;
 */


import { Client, REST, Events, GatewayIntentBits } from 'discord.js';
import { SlashCommandLoader } from './bin/backend/utils/command-loader.js';
import { resolve, join } from 'node:path';
import { AppConfig } from './bin/backend/utils/app-config.js';
import { setEntries } from './bin/backend/injection/container.js';
import { InventoryRepoTests } from './bin/backend/repo/inventory/inventory-repo-tests.js';
import { ItemAPI } from './bin/backend/api/item/item-api.js';
import { ItemTestRepo } from './bin/backend/repo/item/item-repo-test.js';
import { GuildTestRepo } from './bin/backend/repo/guild/guild-repo-test.js';
import { CommandException } from './bin/backend/utils/command-exception.js';
import { InjectionContainer } from './bin/backend/injection/injector.js';
import { DbManager } from './bin/backend/db/db-manager.js';

const __dirname = resolve();
const __dircommand = 'bin/slash-commands'
//DI
setEntries([AppConfig, ItemAPI, ItemTestRepo, InventoryRepoTests, DbManager, GuildTestRepo]);

//Client setup base;
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent, GatewayIntentBits.GuildIntegrations]
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

//Config setup;
const config = new InjectionContainer().get(AppConfig.name);
const rest = new REST().setToken(config.token);

//Config database;
const dbManager = new InjectionContainer().get(DbManager.name);
dbManager.getConnectionPool();

//Command registering base;
const commandLoader = new SlashCommandLoader(join(__dirname, __dircommand));
commandLoader.setup(rest).then((value) => client.commands = value);

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
			if (err instanceof CommandException) {
				if (err.commandInteraction != null) {
					try {
						if (err.commandInteraction.replied || err.commandInteraction.deferred) await err.commandInteraction.editReply({ content: err.message, components: [], embeds: [] });
						else await err.commandInteraction.reply({ content: err.message, components: [], embeds: [] });
					} catch (e) {
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
