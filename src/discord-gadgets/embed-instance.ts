import { ColorResolvable, EmbedBuilder } from "discord.js";
import { ItemInstance } from "../backend/models/item-instance";


export class EmbedInstance{
    instance: ItemInstance;
    constructor (instance: ItemInstance){
        this.instance = instance;
    }

    build(owner: string) : EmbedBuilder{
        let color: ColorResolvable = 0x755630;
        const embed: EmbedBuilder = new EmbedBuilder().setTitle(`(${owner}'s Chester) ${this.instance.itemRef.name} x${this.instance.amount}`).setColor(color);
        if (!this.instance.itemRef.description && this.instance.itemRef.effect) embed.setDescription(this.instance.itemRef.effect);
        else if (this.instance.itemRef.description) embed.setDescription(`*${this.instance.itemRef.description}*`);
        if (this.instance.itemRef.description && this.instance.itemRef.effect) embed.addFields({name: '\u200B', value: this.instance.itemRef.effect})
        embed.addFields({name: 'Unit Value (T$)', value: this.instance.itemRef.value?.toFixed(2) ?? 'N/A', inline: true});
        embed.addFields({name: 'Unit Weight (Slots)', value: this.instance.itemRef.weight?.toFixed(2) ?? 'N/A', inline: true});
        embed.addFields({name: '\u200B', value: '\u200B'});
        embed.addFields({name: 'Estimated stack value', value: 'T$ '+((this.instance.itemRef.value ?? 0)*this.instance.amount).toFixed(2), inline: true});
        embed.addFields({name: 'Estimated stack weight', value: ((this.instance.itemRef.weight ?? 0)*this.instance.amount).toFixed(2) + ' Slots', inline: true});
        return embed;
    }
}