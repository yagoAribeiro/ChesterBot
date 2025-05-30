import { ENV, SCOPE } from "../../injection/container";
import { injectable, InjectionContainer } from "../../injection/injector";
import { Inventory } from "../../models/inventory";
import { ItemInstance } from "../../models/item-instance";
import { IinventoryRepo, INVENTORY_REPO_KEY } from "./i-inventory-repo";
import { IitemRepo, ITEM_REPO_KEY } from "../item/i-item-repo";
import { Item } from "../../models/item";
import { CommandException } from "../../utils/command-exception";

@injectable([ENV.Tests], SCOPE.Singleton, INVENTORY_REPO_KEY)
export class InventoryRepoTests implements IinventoryRepo {
    private itemRepo: IitemRepo;
    private lastInstanceID: number = 1;
    private inventories: Inventory[] = [];
    private instances: ItemInstance[] = [];

    constructor() {
        this.itemRepo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
    }

    createInventory(guildID: string, userID: string, type: number): Promise<Inventory> {
        let inventory: Inventory = new Inventory(guildID, type, userID, this.inventories.length + 1);
        this.inventories.push(inventory);
        return Promise.resolve(inventory);
    }
    async add(itemID: number, inventoryID: number, amount: number): Promise<Item> {
        let itemReference: Item = await this.itemRepo.getItem(itemID);
        if (!itemReference) throw new Error(`❌ Chester couldn't find this item!`);
        let instance: ItemInstance = await this.findInstanceByItemID(itemID, inventoryID);
        if (instance) instance.amount += amount;
        else this.instances.push(new ItemInstance(inventoryID, itemID, amount, 0, new Date(), this.lastInstanceID++, itemReference));
        return Promise.resolve(itemReference);
    }

    async getInstancesByDepth(inventoryID: number, depth: number): Promise<Map<number, ItemInstance>> {
        let max_depth: number = await this.getMaxDepth(inventoryID);
        depth = depth > max_depth ? max_depth : depth < 1 ? 1 : depth;
        let end: number = depth * 8;
        let start: number = end - 8;
        let filtered: Map<number, ItemInstance> = new Map();
        let inventoryInstances: ItemInstance[] = await this.getInstances(inventoryID);
        for (let i = 0; i < inventoryInstances.length; i++) {
            if (i >= start && i < end) filtered.set(i, inventoryInstances[i]);
        }
        return Promise.resolve<Map<number, ItemInstance>>(filtered);
    }

    async getInstancesAutocomplete(inventoryID: number, query: string): Promise<ItemInstance[]> {
        if (query.length > 1) {
            let inventoryInstances: ItemInstance[] = await this.getInstances(inventoryID);
            return inventoryInstances.filter(instance => instance.itemRef.name.trim().toLowerCase().includes(query.trim().toLowerCase()));
        }
        return Promise.resolve([]);
    }


    async getMaxDepth(inventoryID: number): Promise<number> {
        return Math.ceil(await this.getItemCount(inventoryID) / 8.0);
    }

    async getInstances(inventoryID: number): Promise<ItemInstance[]> {
        return Promise.resolve<ItemInstance[]>(this.instances.filter(instance => instance.inventoryID == inventoryID));
    }

    async remove(instanceID: number, amount?: number): Promise<Item> {
        let instance: ItemInstance = await this.getInstance(instanceID);
        if (!instance) throw new Error(`❌ Chester couldn't find this item!`);
        if (instance && (!amount || instance.amount - amount <= 0)) this.instances = this.instances.filter(ins => ins.ID != instanceID); //Delete the entire stack.
        else instance.amount -= amount;
        return Promise.resolve(instance.itemRef);
    }
    getInstance(instanceID: number): Promise<ItemInstance | null> {
        return Promise.resolve(this.instances.find(ins => ins.ID == instanceID));
    }
    getTotalWeight(inventoryID: number): Promise<number> {
        let filtered: Array<ItemInstance> = this.instances.filter(ins => ins.inventoryID == inventoryID);
        let total: number = 0;
        for (let instance of filtered) total += instance.amount * instance.itemRef.weight;
        return Promise.resolve(total);
    }
    
    getTotalItemValue(inventoryID: number): Promise<number> {
        let filtered: Array<ItemInstance> = this.instances.filter(ins => ins.inventoryID == inventoryID);
        let total: number = 0;
        for (let instance of filtered) total += instance.amount * instance.itemRef.value;
        return Promise.resolve(total);
    }

    getInventoriesByDepth(guildID: number, depth: number): Promise<Map<number, Inventory>> {
        throw new Error("Method not implemented.");
    }
    getItemCount(inventoryID: number): Promise<number> {
        return Promise.resolve(this.instances.filter(ins => ins.inventoryID == inventoryID).length);
    }
    clear(inventoryID: number): Promise<boolean> {
        this.instances = this.instances.filter(ins => ins.inventoryID != inventoryID);
        return Promise.resolve(true);
    }
    async describe(instanceID: number): Promise<ItemInstance> {
        let instance: ItemInstance = await this.getInstance(instanceID);
        this.loadItem(instance);
        return Promise.resolve(instance);
    }
    moveItem(instanceID: number, index: number): Promise<boolean> {
        this.instances.find(ins => ins.ID == instanceID).index = index;
        return Promise.resolve(true);
    }
    divide(instanceID: number, divisor: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    give(instanceID: number, amount: number, newInventoryID: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getInventory(inventoryID: number): Promise<Inventory> {
        return Promise.resolve(this.inventories.find((inv) => inv.ID == inventoryID));
    }
    async getInventoryByGuildUser(guildID: string, userID: string): Promise<Inventory> {
        let inventory: Inventory = this.inventories.find((inv) => inv.guildID == guildID && inv.userID == userID);
        if (!inventory) inventory = await this.createInventory(guildID, userID, 0);
        return Promise.resolve(inventory);
    }

    async findInstanceByItemID(itemID: number, inventoryID: number): Promise<ItemInstance> {
        return Promise.resolve(this.instances.find(ins => ins.itemID == itemID && ins.inventoryID == inventoryID));
    }

    async loadItem(instance: ItemInstance): Promise<void> {
        instance.itemRef = await this.itemRepo.getItem(instance.itemID);
    }
}