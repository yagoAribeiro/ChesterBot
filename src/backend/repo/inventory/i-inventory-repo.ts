import { Inventory } from "../../models/inventory";
import { ItemInstance } from "../../models/item-instance";

export interface IinventoryRepo{
    add(itemID: number, inventoryID: number, amount: number) : Promise<boolean>;
    remove(itemID: number, inventoryID: number, amount: number) : Promise<boolean>;
    createInventory(guildID: string, userID?: string, type?: number): Promise<boolean>;
    getInventory(inventoryID: number): Promise<Inventory>;
    getInstance(instanceID: number): Promise<ItemInstance>;    
    getInventoryByGuildUser(guildID: string, userID: string): Promise<Inventory>;
    getInventoriesByDepth(guildID: number, depth: number) : Promise<Map<number, Inventory>>;
    getItemCount(inventoryID: number): Promise<number>;
    getTotalWeight(inventoryID: number): Promise<number>;
    clear(inventoryID: number) : Promise<boolean>;
    moveItem(instanceID: number, index: number) : Promise<boolean>;
    divide(instanceID: number, divisor: number) : Promise<boolean>;
    give(instanceID: number, amount: number, newInventoryID: number): Promise<boolean>;
}

export const INVENTORY_REPO_KEY: string = 'IinventoryRepo';