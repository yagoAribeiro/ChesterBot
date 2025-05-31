import { Item } from "../../models/item";


export interface IitemRepo{
    getItem(itemID: number) : Promise<Item | null>
    getItemByName(discordGuildID: string, itemName: string) : Promise<Item | null>
    createItem(item: Item) : Promise<Item>
    updateItem(itemID: number, model: Item) : Promise<Item>
    deleteItem(itemID: number) : Promise<boolean>
    getItemsByDepth(discordGuildID: string, depth: number, sorting?: number) : Promise<Map<number, Item>>
    getItemsFromAutocomplete(discordGuildID: string, query: string): Promise<Item[]>
    getMaxDepth(guildID:number): Promise<number> 
}

export const ITEM_REPO_KEY: string = 'IitemRepo';