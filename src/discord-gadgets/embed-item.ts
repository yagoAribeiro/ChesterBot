import { EmbedBuilder } from "discord.js";
import { Item } from "../backend/models/item";

export class EmbedItem{
    item: Item;
    constructor (item: Item){
        this.item = item;
    }

    build() : EmbedBuilder{
        const embed: EmbedBuilder = new EmbedBuilder().setTitle(this.item.name).setColor(0x755630);
        embed.setDescription(this.item.description);
        embed.addFields({name: '\u200B', value: '\u200B'});
        embed.addFields({name: 'Value', value: this.item.value.toString(), inline: true});
        embed.addFields({name: 'Weight', value: this.item.weight.toString(), inline: true});
        embed.setFooter({text: `Item created on ${this.item.creationDate.toDateString()}`})
        return embed;
    }
}