import { ApplicationCommandOptionChoiceData, AutocompleteFocusedOption, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { CustomCommand } from '../../backend/models/custom-command';
import { Item } from '../../backend/models/item';
import { InjectionContainer } from '../../backend/injection/injector';
import { IitemRepo, ITEM_REPO_KEY } from '../../backend/repo/item/i-item-repo';
import { itemOptions, ITEM_OPTIONS } from '../../backend/models/command-options/item-options';
import { EmbedItem } from '../../discord-gadgets/embed-item';

export = new CustomCommand(new SlashCommandBuilder()
    .setName('describe_item')
    .setDescription('Describe a global item.')
    .addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.name, () => new SlashCommandStringOption().setRequired(true).setAutocomplete(true))),
    async (interaction) => {
        const itemRepo: IitemRepo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
        const name: string = interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.name));
        const item: Item = await itemRepo.getItemByName(interaction.guildId, name);
        const embed: EmbedItem = new EmbedItem(item);
        await interaction.reply(({embeds: [embed.build()] }));
    }, true, async (interaction) => {
        const itemRepo: IitemRepo =new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
        const focusedOption: AutocompleteFocusedOption = interaction.options.getFocused(true);
        let choices: Item[];
        if (focusedOption.name == itemOptions.getName(ITEM_OPTIONS.name)) {
            choices = await itemRepo.getFromAutocomplete(interaction.guildId, focusedOption.value);
        }
        await interaction.respond(choices.map<ApplicationCommandOptionChoiceData>((item) => {
            return { name: item.name, value: item.name };
        }));
    });
