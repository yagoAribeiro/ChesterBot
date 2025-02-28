import { ActionRowBuilder, ApplicationCommandOptionChoiceData, AutocompleteFocusedOption, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { CustomCommand } from "../../backend/models/custom-command";
import { ITEM_OPTIONS, itemOptions } from "../../backend/models/command-options/item-options";
import { IitemRepo, ITEM_REPO_KEY } from "../../backend/repo/item/i-item-repo";
import { InjectionContainer } from "../../backend/injection/injector";
import { Item } from "../../backend/models/item";

export = new CustomCommand(new SlashCommandBuilder()
.setName('delete_item')
.setDescription('Delete an item from server.')
.addStringOption(itemOptions.getCommandOption(ITEM_OPTIONS.name, () => new SlashCommandStringOption().setRequired(true).setAutocomplete(true))),
 async (interaction) => {
    const itemRepo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
    const name: string = interaction.options.getString(itemOptions.getName(ITEM_OPTIONS.name));
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
        const response = await interaction.reply({content: `Sure you want to delete **${name}** from your server and all inventories? `, components: [rowBuilder]});
        const filter = (i: any) => i.user.id === interaction.user.id;
        const confirmation: ButtonInteraction<CacheType> = (await response.awaitMessageComponent({filter: filter, time: 60_000})) as ButtonInteraction;
        if (confirmation.customId === 'confirm'){
            await itemRepo.delete((await itemRepo.getItemByName(interaction.guildId, name)).ID);
            (await (await confirmation.update({content: `**${name}** was succesfully deleted!`, components: []})).fetch()).react('👅');
        }else if (confirmation.customId === 'cancel'){
            await confirmation.deferUpdate();
            await confirmation.deleteReply();
        }
}, true, 
async (interaction) =>{
    const focusedOption: AutocompleteFocusedOption = interaction.options.getFocused(true);
    const itemRepo: IitemRepo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
    let choices: Item[];
    if (focusedOption.name == itemOptions.getName(ITEM_OPTIONS.name)){
        choices = await itemRepo.getFromAutocomplete(interaction.guildId, focusedOption.value);
    }
    await interaction.respond(choices.map<ApplicationCommandOptionChoiceData>((item) => {
        return {name: item.name, value: item.name};
    }));
});