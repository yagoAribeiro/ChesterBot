import { Item } from "../../models/item";


export interface IitemRepo{
    getItem(itemID: number) : Promise<Item | null>
    getItemByName(guildID: string, itemName: string) : Promise<Item | null>
    createItem(item: Item) : Promise<void>
    updateItem(itemID: number, model: Item) : Promise<void>
    deleteItem(itemID: number) : Promise<void>
    getItemsByDepth(guildID: string, depth: number, sorting?: number) : Promise<Map<number, Item>>
    getItemsFromAutocomplete(guildID: string, query: string): Promise<Item[]>
    getMaxDepth(guildID: string): Promise<number> 
}

export const ITEM_REPO_KEY: string = 'IitemRepo';