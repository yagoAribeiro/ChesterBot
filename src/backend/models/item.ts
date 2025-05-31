import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";
import { RowDataPacket } from "mysql2";

export class Item implements DataModel<Item>{
    ID?: number;
    guildID: string;
    name: string;
    resume: string;
    description: string;
    effect: string;
    weight: number;
    value: number;
    secret: boolean;
    creationDate: Date;

    constructor(guildID: string, name: string, secret?: boolean, creationDate?: Date,description?: string, resume?: string, effect?: string, weight?: number, value?: number, ID?: number){
        this.guildID = guildID;
        this.name = name;
        this.resume = resume;
        this.description = description;
        this.weight = weight;
        this.value = value;
        this.secret = secret;
        this.creationDate = creationDate;
        this.effect = effect;
        this.ID = ID;
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