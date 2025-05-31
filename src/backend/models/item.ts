import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";
import { RowDataPacket } from "mysql2";
import { GuildModel } from "./guild";

export enum ITEM_FIELDS{
    id,
    guildID,
    itemName,
    itemResume,
    itemDescription,
    effect,
    weight,
    itemValue,
    secret,
    creationDate
}

export class Item implements DataModel<Item, ITEM_FIELDS>{
    ID?: number;
    guildID: number;
    name: string;
    resume: string;
    description: string;
    effect: string;
    weight: number;
    value: number;
    secret: boolean;
    creationDate: Date;
    guildRef?: GuildModel;

    constructor(guildID: number, name: string, secret?: boolean, creationDate?: Date,description?: string, resume?: string, effect?: string, weight?: number, value?: number, guildRef?: GuildModel, ID?: number){
        this.guildID = guildID;
        this.name = name;
        this.resume = resume;
        this.description = description;
        this.weight = weight;
        this.value = value;
        this.secret = secret;
        this.creationDate = creationDate;
        this.effect = effect;
        this.guildRef = guildRef;
        this.ID = ID;
    }
    getByEnum(index: ITEM_FIELDS) {
        switch(index){
            case ITEM_FIELDS.id: return this.ID;
            case ITEM_FIELDS.guildID: return this.guildID;
            case ITEM_FIELDS.itemName: return this.name;
            case ITEM_FIELDS.itemResume: return this.resume;
            case ITEM_FIELDS.itemDescription: return this.description;
            case ITEM_FIELDS.effect: return this.effect;
            case ITEM_FIELDS.weight: return this.weight;
            case ITEM_FIELDS.itemValue: return this.value;
            case ITEM_FIELDS.secret: return this.secret;
            case ITEM_FIELDS.creationDate: return this.creationDate;
        }
    }
    static fromDbRow(row: RowDataPacket): Item {
        throw new Error("Method not implemented.");
    }
    compareTo(b: Item): number {
        return this.name > b.name ? 1 : this.name < b.name ? -1 : 0;
    }
    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder> {
        return Promise.resolve(new StringSelectMenuOptionBuilder().setLabel(`${(index == null ? '' : index.toString()+'. ')}${this.name}`).setValue(this.ID.toString()));
    }
   
}