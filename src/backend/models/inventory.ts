import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";
import { RowDataPacket } from "mysql2";
import { GuildUser } from "./guildUser";

export enum INVENTORY_FIELDS {
    ID,
    GuildUserID,
    InventoryType,
    Currency,
    MaxWeight,
    CustomIdentifier,
    CustomDescription
}

export enum INVENTORY_TYPES {
    userInventory = 0,
    entityInventory = 1
}

export class Inventory implements DataModel<Inventory, INVENTORY_FIELDS> {
    ID?: number;
    guildUserID: number;
    type: INVENTORY_TYPES;
    currency?: number;
    maxWeight?: number;
    guildUserRef?: GuildUser;
    customIdentifier?: string;
    customDescription?: string;

    constructor(guildUserID: number, type: INVENTORY_TYPES, currency?: number, maxWeight?: number, customIdentifier?: string, customDescription?: string, guildUserRef?: GuildUser, ID?: number) {
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
        switch (index) {
            case INVENTORY_FIELDS.ID: return this.ID;
            case INVENTORY_FIELDS.GuildUserID: return this.guildUserID;
            case INVENTORY_FIELDS.InventoryType: return this.type;
            case INVENTORY_FIELDS.Currency: return this.currency;
            case INVENTORY_FIELDS.MaxWeight: return this.maxWeight;
            case INVENTORY_FIELDS.CustomDescription: return this.customDescription;
            case INVENTORY_FIELDS.CustomIdentifier: return this.customIdentifier;
        }
    }
    static getTableName(): string {
        return "inventory";
    }

    static getColumnName(index: INVENTORY_FIELDS): string {
        return INVENTORY_FIELDS[index];
    }
    compareTo(b: Inventory): number {
        throw new Error("Method not implemented.");
    }
    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder> {
        return Promise.resolve(new StringSelectMenuOptionBuilder({ label: '', description: '', value: '' }));
    }



}