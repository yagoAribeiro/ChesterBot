import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, MessageFlags, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "../backend/models/i-data-model";
import { on } from "process";


export class SliderDialog<TModel extends DataModel> {
    private builder: (models: Map<number, TModel>) => Promise<EmbedBuilder>;
    private getter: (page: number) => Promise<Map<number, TModel>>;
    private onSelect: (modelID: number) => Promise<EmbedBuilder>;
    private models: Map<number, TModel>;
    private page: number = 1;
    private maxPage: number;
    private commandInteraction: CommandInteraction;

    constructor(commandInteraction: CommandInteraction, maxPage: number, builder: (models: Map<number, TModel>) => Promise<EmbedBuilder>, getter: (page: number) => Promise<Map<number, TModel>>, onSelect: (modelID: number) => Promise<EmbedBuilder>) {
        this.builder = builder;
        this.getter = getter;
        this.onSelect = onSelect;
        this.maxPage = maxPage;
        this.commandInteraction = commandInteraction;
    }

    async build(): Promise<InteractionResponse<boolean>> {
        let response: InteractionResponse<boolean> = null;
        let message: Message<boolean> = null;
        if (!this.commandInteraction.deferred) response = await this.commandInteraction.deferReply();
        message = await this.commandInteraction.editReply({ embeds: [await this.buildEmbeds()], components: [this.buildMenuRow(), this.buildButtonRow()] });
        const buttonCollector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120_000 });
        buttonCollector.on('collect', async i => {
            if (i.user.id === this.commandInteraction.user.id) {
                let r = await i.deferUpdate();
                if (i.customId != 'return') {
                    this.page += i.customId == 'left' ? -1 : 1;
                    this.page = this.page >= 1 && this.page <= this.maxPage ? this.page : this.page < 1 ? this.maxPage : 1;
                }
                await r.edit({ embeds: [await this.buildEmbeds()], components: [this.buildMenuRow(), this.buildButtonRow()] });
            } else {
                i.reply({ content: `Hey, these buttons aren't for you!`, flags: MessageFlags.Ephemeral });
            }
        });
        buttonCollector.on('end', _ => {
            console.log(`"${this.commandInteraction.channelId}" button interaction collector ended succesfully.`);
            message.edit({content: '*Im not listening to this anymore!*', components: [] });
        });
        const selectionCollector = message.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 120_000 });
        selectionCollector.on('collect', async i => {
            let r = await i.deferUpdate();
            if (i.customId == 'selector') {
                const btnReturn = new ButtonBuilder()
                    .setCustomId('return')
                    .setLabel('Return')
                    .setEmoji('↩️')
                    .setStyle(ButtonStyle.Primary)
                const actionRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>();
                actionRow.addComponents(btnReturn);
                const embedModel: EmbedBuilder = await this.onSelect(Number((i as StringSelectMenuInteraction).values[0]));
                await r.edit({ embeds: [embedModel], components: [actionRow] });
            }
        });
        selectionCollector.on('end', _ => {
            console.log(`"${this.commandInteraction.channelId}" string select menu interaction collector ended succesfully.`);
        });
        return response;
    }

    private buildButtonRow(): ActionRowBuilder<ButtonBuilder> {
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

    private buildMenuRow(): ActionRowBuilder<StringSelectMenuBuilder> {
        const modelsAsOptions: StringSelectMenuOptionBuilder[] = [];
        this.models.forEach((value, key) => modelsAsOptions.push(value.toSelectOption(key)));
        const menu = new StringSelectMenuBuilder()
            .setCustomId('selector')
            .setPlaceholder('Select an item to describe')
            .addOptions(...modelsAsOptions);
        return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents([menu]);
    }

    private async buildEmbeds(): Promise<EmbedBuilder> {
        this.models = await this.getter(this.page);
        const embed: EmbedBuilder = await this.builder(this.models);
        embed.setFooter({ text: `Page ${this.page.toString()}/${this.maxPage.toString()}` });
        return embed;
    }
}