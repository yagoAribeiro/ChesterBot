import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";
import { RowDataPacket } from "mysql2";
import { GuildUser } from "./guildUser";

export enum INVENTORY_FIELDS{
    id,
    guildUserID,
    inventoryType,
    currency,
    maxWeight,
    customIdentifier,
    customDescription
}

export enum INVENTORY_TYPES{
    userInventory = 0,
    entityInventory = 1
}

export class Inventory implements DataModel<Inventory, INVENTORY_FIELDS>{
    ID?: number;
    guildUserID: number;
    type: INVENTORY_TYPES;
    currency?: number;
    maxWeight?: number;
    guildUserRef?: GuildUser;
    customIdentifier?: string;
    customDescription?: string;

    constructor(guildUserID: number, type: INVENTORY_TYPES, currency?: number, maxWeight?: number, customIdentifier?: string, customDescription?: string, guildUserRef?: GuildUser, ID?: number){
        this.ID = ID;
        this.guildUserID = guildUserID;
        this.type = type;
        this.currency = currency;
        this.maxWeight = maxWeight;
        this.customDescription = customDescription;
        this.customIdentifier = customIdentifier;
        this.guildUserRef = guildUserRef;
    }
    getByEnum(index: INVENTORY_FIELDS) {
        switch(index){
            case INVENTORY_FIELDS.id: return this.ID;
            case INVENTORY_FIELDS.guildUserID: return this.guildUserID;
            case INVENTORY_FIELDS.inventoryType: return this.type;
            case INVENTORY_FIELDS.currency: return this.currency;
            case INVENTORY_FIELDS.maxWeight: return this.maxWeight;
            case INVENTORY_FIELDS.customDescription: return this.customDescription;
            case INVENTORY_FIELDS.customIdentifier: return this.customIdentifier;
        }
    }
    static fromDbRow(row: RowDataPacket): Inventory {
        throw new Error("Method not implemented.");
    }
    compareTo(b: Inventory): number {
        throw new Error("Method not implemented.");
    }
    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder> {
        return Promise.resolve(new StringSelectMenuOptionBuilder({label: '', description: '', value: ''}));
    }

    
    
}