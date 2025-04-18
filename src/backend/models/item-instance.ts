import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";
import { Item } from "./item";

export class ItemInstance implements DataModel<ItemInstance>{
    toSelectOption(): Promise<StringSelectMenuOptionBuilder> {
        throw new Error();
    }
    ID?: number;
    inventoryID: number;
    index: number;
    itemID: number;
    itemRef: Item;
    amount: number;
    lastUpdate: Date;

    constructor(inventoryID: number, itemID: number, amount: number, index: number, lastUpdate?: Date, ID?: number){
        this.inventoryID = inventoryID;
        this.itemID = itemID;
        this.amount = amount;
        this.index = index;
        this.lastUpdate = lastUpdate;
        this.ID = ID;
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