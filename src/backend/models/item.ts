import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";
import { RowDataPacket } from "mysql2";
import { GuildModel } from "./guild";

export enum ITEM_FIELDS {
    ID,
    GuildID,
    ItemName,
    ItemResume,
    ItemDescription,
    Effect,
    Weight,
    ItemValue,
    Secret,
    CreationDate
}

export class Item implements DataModel<Item, ITEM_FIELDS> {
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

    constructor(guildID: number, name: string, secret?: boolean, creationDate?: Date, description?: string, resume?: string, effect?: string, weight?: number, value?: number, guildRef?: GuildModel, ID?: number) {
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
        switch (index) {
            case ITEM_FIELDS.ID: return this.ID;
            case ITEM_FIELDS.GuildID: return this.guildID;
            case ITEM_FIELDS.ItemName: return this.name;
            case ITEM_FIELDS.ItemResume: return this.resume;
            case ITEM_FIELDS.ItemDescription: return this.description;
            case ITEM_FIELDS.Effect: return this.effect;
            case ITEM_FIELDS.Weight: return this.weight;
            case ITEM_FIELDS.ItemValue: return this.value;
            case ITEM_FIELDS.Secret: return this.secret;
            case ITEM_FIELDS.CreationDate: return this.creationDate;
        }
    }
    static getTableName(): string {
        return "item";
    }

    static getColumnName(index: ITEM_FIELDS): string {
        return ITEM_FIELDS[index];
    }
    compareTo(b: Item): number {
        return this.name > b.name ? 1 : this.name < b.name ? -1 : 0;
    }
    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder> {
        return Promise.resolve(new StringSelectMenuOptionBuilder().setLabel(`${(index == null ? '' : index.toString() + '. ')}${this.name}`).setValue(this.ID.toString()));
    }

}