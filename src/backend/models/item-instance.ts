import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";
import { Item } from "./item";

export class ItemInstance implements DataModel<ItemInstance>{   
    ID?: number;
    inventoryID: number;
    index: number;
    itemID: number;
    itemRef: Item;
    amount: number;
    lastUpdate: Date;

    constructor(inventoryID: number, itemID: number, amount: number, index: number, lastUpdate?: Date, ID?: number, itemRef?: Item){
        this.inventoryID = inventoryID;
        this.itemID = itemID;
        this.amount = amount;
        this.index = index;
        this.lastUpdate = lastUpdate;
        this.ID = ID;
        this.itemRef = itemRef;
    }

    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder> {
        return Promise.resolve(new StringSelectMenuOptionBuilder().setLabel(`${(index == null ? '' : index.toString()+'. ')}${this.itemRef.name} x${this.amount}`).setValue(this.ID.toString()))
    }

    compareTo(b: ItemInstance): number {
       return this.index > b.index ? 1 : this.index < b.index ? -1 : 0;
    }

    toMap(): Map<string, string> {
        throw new Error("Method not implemented.");
    }
    fromMap(map: Map<string, string>): ItemInstance {
        throw new Error("Method not implemented.");
    }
}