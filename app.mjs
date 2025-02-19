import { Client, REST, Events, GatewayIntentBits } from 'discord.js';
import { SlashCommandLoader } from './bin/backend/utils/command-loader.js';
import { resolve, join } from 'node:path';
import {InjectionContainer} from './bin/backend/injection/injector.js';
import {Entries} from './bin/backend/injection/container.js';
import 'reflect-metadata';
import config from './config.json' with {type: "json"};

const __dirname = resolve();
const __dircommand = 'bin/slash-commands';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
	 GatewayIntentBits.MessageContent, GatewayIntentBits.GuildIntegrations] });

//Client setup base;
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const rest = new REST().setToken(config.token);

//DI
InjectionContainer.init(Entries);

//Command registering base;
const command_loader = new SlashCommandLoader(join(__dirname, __dircommand));
command_loader.setup(rest, config.clientID).then((value) => client.commands = value);

//Command handling base;
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	}
	catch (error){

	}
});


client.login(config.token);
