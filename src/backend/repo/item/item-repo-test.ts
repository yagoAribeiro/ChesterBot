import { ItemAPI } from "../../api/item/item-api";
import { ENV, injectable, SCOPE } from "../../injection/injector";
import { Item } from "../../models/item";
import { BaseRepo } from "../base-repo";
import { IitemRepo } from "./i-item-repo";

@injectable([ENV.Tests], SCOPE.Singleton)
export class ItemTestRepo extends BaseRepo<ItemAPI> implements IitemRepo{

    private __items: Item[] = [];

    constructor(api: ItemAPI){
        super(api);
     }
    
    getFromAutocomplete(guildID: string, query: string): Promise<Item[]> {
        if (query.length >= 3){
            let filtered: Array<Item> = this.__items.filter((item) => item.guildID == guildID && item.name.includes(query));
            return Promise.resolve(filtered);
        }
        return Promise.resolve([]);
    }

    getAll(guildID: string, depth?: number): Promise<Item[]>{
        let end: number = depth*15;
        let filtered: Array<Item> = this.__items.filter((item) => item.guildID == guildID);
        return Promise.resolve<Item[]>(filtered.slice(end-15, filtered.length < end ? filtered.length : end));
    }
    getItem(itemId: number): Promise<Item|null> {
        return Promise.resolve<Item>(this.__items.find((item) => item.ID == itemId));
    }

    getItemByName(guildID: string, itemName: string): Promise<Item | null> {
        throw new Error("Method not implemented.");
    }
    
    addItem(item: Item): Promise<void> {
        item.ID = this.__items.length;
        this.__items.push(item);
        return Promise.resolve();
    }
    updateItem(itemId: number, model: Item): Promise<void> {
        let index: number = this.__items.findIndex((item) => item.ID == itemId)
        this.__items[index] = model;
        return Promise.resolve();
    }
    delete(itemId: number): Promise<void> {
        let index: number = this.__items.findIndex((item) => item.ID == itemId);
        this.__items.splice(index, 1);
        return Promise.resolve();
    }
    
}