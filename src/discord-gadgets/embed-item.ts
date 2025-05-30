import { ColorResolvable, EmbedBuilder } from "discord.js";
import { Item } from "../backend/models/item";

export const enum EMBED_ITEM_FLAGS {
    Delete,
    Create,
    View,
}

export class EmbedItem{
    item: Item;
    constructor (item: Item){
        this.item = item;
    }

    build(embedItemFlag: EMBED_ITEM_FLAGS) : EmbedBuilder{
        let color: ColorResolvable;
        let prefix: string;
        switch(embedItemFlag){
            case EMBED_ITEM_FLAGS.Create:
                color = 0x34eb6b;
                prefix = '(Preview)';
                break;
            case EMBED_ITEM_FLAGS.View:
                color = 0x755630;
                prefix = '';
                break;
            case EMBED_ITEM_FLAGS.Delete:
                color = 0xeb3434;
                prefix = '(Delete)'
                break;
        }
        const embed: EmbedBuilder = new EmbedBuilder().setTitle(`${prefix}${this.item.name}`).setColor(color);
        if (!this.item.description && this.item.effect) embed.setDescription(this.item.effect);
        else if (this.item.description) embed.setDescription(`*${this.item.description}*`);
        if (this.item.description && this.item.effect) embed.addFields({name: '\u200B', value: this.item.effect})
        embed.addFields({name: 'Value (T$)', value: this.item.value?.toFixed(2) ?? 'N/A', inline: true});
        embed.addFields({name: 'Weight (Slots)', value: this.item.weight?.toFixed(2) ?? 'N/A', inline: true});
        return embed;
    }
}