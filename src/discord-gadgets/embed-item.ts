import { EmbedBuilder } from "discord.js";
import { Item } from "../backend/models/item";

export class EmbedItem{
    item: Item;
    constructor (item: Item){
        this.item = item;
    }

    build(preview: boolean = false) : EmbedBuilder{
        const embed: EmbedBuilder = new EmbedBuilder().setTitle(`${preview? '(Preview) ': ''}${this.item.name}`).setColor(0x755630);
        if (!this.item.description && this.item.effect) embed.setDescription(this.item.effect);
        else if (this.item.description) embed.setDescription(`*${this.item.description}*`);
        if (this.item.description && this.item.effect) embed.addFields({name: '\u200B', value: this.item.effect})
        embed.addFields({name: 'Value', value: this.item.value?.toString() ?? 'N/A', inline: true});
        embed.addFields({name: 'Weight', value: this.item.weight?.toString() ?? 'N/A', inline: true});
        embed.setFooter({text: `Item created on ${this.item.creationDate.toDateString()}`})
        return embed;
    }
}