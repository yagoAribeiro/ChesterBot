import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";

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
    toSelectOption(index?: number): StringSelectMenuOptionBuilder {
        return new StringSelectMenuOptionBuilder().setLabel(`${(index == null ? '' : index.toString()+'. ')}${this.name}`).setValue(this.ID.toString());
    }

    toMap(): Map<string, any> {
        throw new Error("Method not implemented.");
    }
    fromMap(map: Map<string, any>): Item {
        throw new Error("Method not implemented.");
    }
   
}