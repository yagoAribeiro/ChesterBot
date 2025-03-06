import { ActionRowBuilder, APIEmbedField, ButtonBuilder, ButtonStyle, CommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, MessageFlags, RestOrArray } from "discord.js";


export class SliderDialog {
    private getter: (embed: EmbedBuilder, page: number) => Promise<EmbedBuilder>
    private page: number = 1;
    private maxPage: number;
    private commandInteraction: CommandInteraction

    constructor(commandInteraction: CommandInteraction, getter: (embed: EmbedBuilder, page: number) => Promise<EmbedBuilder>, maxPage: number) {
        this.getter = getter;
        this.maxPage = maxPage;
        this.commandInteraction = commandInteraction;
    }

    async build(): Promise<InteractionResponse<boolean>>{
        let response: InteractionResponse<boolean> = null;
        if (!this.commandInteraction.deferred) response = await this.commandInteraction.deferReply();
        await this.commandInteraction.editReply({components: [this.buildRow()], embeds: [await this.buildEmbed()]});
        const collector = response.createMessageComponentCollector({componentType: ComponentType.Button, time: 120_000});
        collector.on('collect', async i =>{
            if (i.user.id === this.commandInteraction.user.id) {
                let r = await i.deferUpdate();
                this.page += i.customId == 'left' ? -1 : 1;
                this.page = this.page >= 1 && this.page < this.maxPage ? this.page : this.page < 1 ? this.maxPage : 1;
                await r.edit({embeds: [await this.buildEmbed()]});
            } else {
                i.reply({ content: `Hey, these buttons aren't for you!`, flags: MessageFlags.Ephemeral });
            }
        });
        collector.on('end', _ =>{
            console.log(`"${this.commandInteraction.channelId}" slider interaction collector ended succesfully.`);
        });
        return response;
    }

    buildRow(): ActionRowBuilder<ButtonBuilder> {
        const btnLeft = new ButtonBuilder()
            .setCustomId('left')
            .setLabel('Previous')
            .setEmoji('⬅️')
            .setStyle(ButtonStyle.Primary);
        const btnRight = new ButtonBuilder()
            .setCustomId('right')
            .setLabel('Next')
            .setEmoji('➡️')
            .setStyle(ButtonStyle.Primary);
        return new ActionRowBuilder<ButtonBuilder>().addComponents([btnLeft, btnRight]);
    }

    async buildEmbed(): Promise<EmbedBuilder>{
        const embed = new EmbedBuilder().setTitle(`${this.commandInteraction.guild.name}'s registered items.`)
        .setColor(0x755630)
        .setDescription('Note: all the items shown in here are items that are not marked as "secret". Secret items can only be viewed within inventory commands if the requirements are met.')
        .addFields({name: '\u200B', value: '\u200B'})
        .setFooter({text: `Page: ${this.page}/${this.maxPage}`}); 
        await this.getter(embed, this.page);
        embed.addFields({name: '\u200B', value: '\u200B'});
        return embed;
    }

}