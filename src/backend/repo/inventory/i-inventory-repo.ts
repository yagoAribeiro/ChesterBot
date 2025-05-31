import { Inventory } from "../../models/inventory";
import { Item } from "../../models/item";
import { ItemInstance } from "../../models/item-instance";

export interface IinventoryRepo{
    add(itemID: number, inventoryID: number, amount: number) : Promise<Item>;
    remove(instanceID: number, amount: number) : Promise<Item>;
    give(inventoryID: number, instanceID: number, amount?: number) : Promise<boolean>;
    update(inventoryID: number, currency?: number, maxWeight?: number): Promise<Inventory>;
    createInventory(guildID: string, userID?: string, type?: number): Promise<Inventory>;
    getInventory(inventoryID: number): Promise<Inventory>;
    getInstance(instanceID: number): Promise<ItemInstance | null>;    
    getInventoryByGuildUser(guildID: string, userID: string): Promise<Inventory>;
    getInstances(inventoryID: number) : Promise<ItemInstance[]>;
    getInstancesAutocomplete(inventoryID: number, query: string) : Promise<ItemInstance[]>;
    getInstancesByDepth(inventoryID: number, depth: number) : Promise<Map<number, ItemInstance>>;
    getMaxDepth(inventoryID: number) : Promise<number>;
    getItemCount(inventoryID: number): Promise<number>;
    getTotalWeight(inventoryID: number): Promise<number>;
    getTotalItemValue(inventoryID: number): Promise<number>;
}

export const INVENTORY_REPO_KEY: string = 'IinventoryRepo';