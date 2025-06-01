import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";
import { Item } from "./item";
import { RowDataPacket } from "mysql2";

export enum ITEM_INSTANCE_FIELDS {
    ID,
    InventoryID,
    ItemID,
    Amount,
    LastUpdate,
    InstanceIndex
}

export class ItemInstance implements DataModel<ItemInstance, ITEM_INSTANCE_FIELDS> {
    ID?: number;
    inventoryID: number;
    index: number;
    itemID: number;
    itemRef: Item;
    amount: number;
    lastUpdate: Date;

    constructor(inventoryID: number, itemID: number, amount: number, index: number, lastUpdate?: Date, itemRef?: Item, ID?: number) {
        this.inventoryID = inventoryID;
        this.itemID = itemID;
        this.amount = amount;
        this.index = index;
        this.lastUpdate = lastUpdate;
        this.ID = ID;
        this.itemRef = itemRef;
    }

    getByEnum(index: ITEM_INSTANCE_FIELDS) {
        switch (index) {
            case ITEM_INSTANCE_FIELDS.ID: return this.ID;
            case ITEM_INSTANCE_FIELDS.InventoryID: return this.inventoryID;
            case ITEM_INSTANCE_FIELDS.ItemID: return this.itemID;
            case ITEM_INSTANCE_FIELDS.Amount: return this.amount;
            case ITEM_INSTANCE_FIELDS.LastUpdate: return this.lastUpdate;
            case ITEM_INSTANCE_FIELDS.InstanceIndex: return this.index;
        }
    }
    static getTableName(): string {
        return "iteminstance";
    }

    static getColumnName(index: ITEM_INSTANCE_FIELDS): string {
        return ITEM_INSTANCE_FIELDS[index];
    }

    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder> {
        return Promise.resolve(new StringSelectMenuOptionBuilder().setLabel(`${(index == null ? '' : index.toString() + '. ')}${this.itemRef.name} x${this.amount}`).setValue(this.ID.toString()))
    }

    compareTo(b: ItemInstance): number {
        return this.index > b.index ? 1 : this.index < b.index ? -1 : 0;
    }

}