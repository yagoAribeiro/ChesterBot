import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";
import { Item } from "./item";

class ItemInstance implements DataModel<ItemInstance>{
    toSelectOption(): StringSelectMenuOptionBuilder {
        throw new Error("Method not implemented.");
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

    toMap(): Map<string, string> {
        throw new Error("Method not implemented.");
    }
    fromMap(map: Map<string, string>): ItemInstance {
        throw new Error("Method not implemented.");
    }
}