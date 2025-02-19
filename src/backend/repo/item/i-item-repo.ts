import { Item } from "../../models/item";

export interface IitemRepo {
    getAll(guildID: string, depth?: number) : Promise<Item[]>
    getFromAutocomplete(guildID: string, query: string, depth?: number) : Promise<Item[]>
    getItem(itemID: number) : Promise<Item | null>
    getItemByName(guildID: string, itemName: string) : Promise<Item | null>
    addItem(item: Item) : Promise<void>
    updateItem(itemID: number, model: Item) : Promise<void>
    delete(itemID: number) : Promise<void>
}

export const ITEM_REPO_KEY: string = 'IitemRepo';