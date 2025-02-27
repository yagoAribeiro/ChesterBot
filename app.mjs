import { Client, REST, Events, GatewayIntentBits } from 'discord.js';
import { SlashCommandLoader } from './bin/backend/utils/command-loader.js';
import { resolve, join } from 'node:path';
import { InjectionContainer } from './bin/backend/injection/injector.js';
import { Entries } from './bin/backend/injection/container.js';
import config from './config.json' with {type: 'json'};

const __dirname = resolve();
const __dircommand = 'bin/slash-commands';

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent, GatewayIntentBits.GuildIntegrations]
});

//Client setup base;
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const rest = new REST().setToken(config.token);

//DI
InjectionContainer.init(Entries);

//Command registering base;
const commandLoader = new SlashCommandLoader(join(__dirname, __dircommand));
commandLoader.setup(rest, config.clientID).then((value) => client.commands = value);

//Command handling base;
client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isCommand) {
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		if (interaction.isChatInputCommand()) {
			try {
				await command.execute(interaction);
			}
			catch (error) {

			}
		}else if (interaction.isAutocomplete()){
			try {
				await command.autocomplete(interaction);
			}
			catch (error) {

			}
		}
	}

});


client.login(config.token);
