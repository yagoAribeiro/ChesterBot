import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";
import { Item } from "./item";
import { RowDataPacket } from "mysql2";

export enum ITEM_INSTANCE_FIELDS{
    id,
    inventoryID,
    itemID,
    amount,
    lastUpdate,
    instanceIndex
}

export class ItemInstance implements DataModel<ItemInstance, ITEM_INSTANCE_FIELDS>{   
    ID?: number;
    inventoryID: number;
    index: number;
    itemID: number;
    itemRef: Item;
    amount: number;
    lastUpdate: Date;

    constructor(inventoryID: number, itemID: number, amount: number, index: number, lastUpdate?: Date, itemRef?: Item, ID?: number){
        this.inventoryID = inventoryID;
        this.itemID = itemID;
        this.amount = amount;
        this.index = index;
        this.lastUpdate = lastUpdate;
        this.ID = ID;
        this.itemRef = itemRef;
    }
    getByEnum(index: ITEM_INSTANCE_FIELDS) {
        switch(index){
            case ITEM_INSTANCE_FIELDS.id: return this.ID;
            case ITEM_INSTANCE_FIELDS.inventoryID: return this.inventoryID;
            case ITEM_INSTANCE_FIELDS.itemID: return this.itemID;
            case ITEM_INSTANCE_FIELDS.amount: return this.amount;
            case ITEM_INSTANCE_FIELDS.lastUpdate: return this.lastUpdate;
            case ITEM_INSTANCE_FIELDS.instanceIndex: return this.index;
        }
    }
    static fromDbRow(row: RowDataPacket): ItemInstance {
        throw new Error("Method not implemented.");
    }

    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder> {
        return Promise.resolve(new StringSelectMenuOptionBuilder().setLabel(`${(index == null ? '' : index.toString()+'. ')}${this.itemRef.name} x${this.amount}`).setValue(this.ID.toString()))
    }

    compareTo(b: ItemInstance): number {
       return this.index > b.index ? 1 : this.index < b.index ? -1 : 0;
    }

}