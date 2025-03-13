import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, InteractionResponse, Message } from "discord.js";
import { InteractionResolver } from "./interaction-resolver";


/**
 * Class that handles discord confirmation action rows.
 */
export class ConfirmationDialog {
    filter?: (i: any) => boolean;

    constructor(filter?: (i: any) => boolean) {
        this.filter = filter;
    }

    build(): ActionRowBuilder<ButtonBuilder> {
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
        return new ActionRowBuilder<ButtonBuilder>().addComponents([btnConfirm, btnCancel]);
    }

    async handle(response: InteractionResponse<boolean> | Message<boolean>, onOk?: (confirmation: ButtonInteraction<CacheType>) => Promise<void>, onCancel?: (confirmation: ButtonInteraction<CacheType>) => Promise<void>): Promise<void>{
        const confirmation: ButtonInteraction<CacheType> = (await response.awaitMessageComponent({filter: this.filter, time: 60_000})) as ButtonInteraction;
        await confirmation.deferUpdate();
        if (confirmation.customId === 'confirm' && onOk){
            await onOk(confirmation);
        } 
        else if (onCancel) await onCancel(confirmation);
    }

}