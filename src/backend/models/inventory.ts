import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";


export class Inventory implements DataModel<Inventory>{
    ID?: number;
    userID?: string;
    type: number;
    guildID: string;
    currency?: number;
    maxWeight?: number;

    constructor(guildID: string, type: number, userID?: string, currency?: number, maxWeight?: number, ID?: number){
        this.ID = ID;
        this.userID = userID;
        this.type = type;
        this.currency = currency;
        this.maxWeight = maxWeight;
        this.guildID = guildID;
    }
    compareTo(b: Inventory): number {
        throw new Error("Method not implemented.");
    }

    toMap(): Map<string, any> {
        throw new Error("Method not implemented.");
    }
    fromMap(map: Map<string, any>): Inventory {
        throw new Error("Method not implemented.");
    }
    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder> {
        return Promise.resolve(new StringSelectMenuOptionBuilder({label: '', description: '', value: ''}));
    }

    
    
}