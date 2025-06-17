import { ENV, SCOPE } from "../../injection/container";
import { injectable, InjectionContainer } from "../../injection/injector";
import { Inventory, INVENTORY_TYPES } from "../../models/inventory";
import { ItemInstance } from "../../models/item-instance";
import { IinventoryRepo, INVENTORY_REPO_KEY } from "./i-inventory-repo";
import { IitemRepo, ITEM_REPO_KEY } from "../item/i-item-repo";
import { Item } from "../../models/item";
import { GUILD_REPO_KEY, IGuildRepo } from "../guild/i-guild-repo";
import { GuildUser } from "../../models/guildUser";

@injectable([ENV.Tests], SCOPE.Singleton, INVENTORY_REPO_KEY)
export class InventoryRepoTests implements IinventoryRepo {
    private itemRepo: IitemRepo;
    private inventoryIncrement: number = 1;
    private instancesIncrement: number = 1;
    private __inventories: Inventory[] = [];
    private __instances: ItemInstance[] = [];
    private guildRepo: IGuildRepo;

    constructor() {
        this.itemRepo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
        this.guildRepo = new InjectionContainer().get<IGuildRepo>(GUILD_REPO_KEY);
    }

    async createInventory(discordGuildID: string, discordUserID: string, type: INVENTORY_TYPES): Promise<Inventory> {
        let guildUser: GuildUser = await this.guildRepo.getGuildUserByDiscordID(discordGuildID, discordUserID);
        let inventory: Inventory = new Inventory(guildUser.ID, type, 0, 10, null, null, guildUser, this.inventoryIncrement++);
        this.__inventories.push(inventory);
        return Promise.resolve(inventory);
    }
    async add(itemID: number, inventoryID: number, amount: number): Promise<Item> {
        let itemReference: Item = await this.itemRepo.getItem(itemID);
        if (!itemReference) throw new Error(`❌ Chester couldn't find this item!`);
        let instance: ItemInstance = await this.findInstanceByItemID(itemID, inventoryID);
        if (instance) instance.amount += amount;
        else this.__instances.push(new ItemInstance(inventoryID, itemID, amount, 0, new Date(), itemReference, this.instancesIncrement++));
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

     async update(inventoryID: number, currency?: number, maxWeight?: number): Promise<Inventory> {
        let inventory: Inventory = await this.getInventory(inventoryID);
        if (!currency && !maxWeight) throw new Error('You need to update something!');
        if (currency) inventory.currency = currency;
        if (maxWeight) inventory.maxWeight = maxWeight;
        return Promise.resolve(inventory);
    }

    async give(inventoryID: number, instanceID: number, amount: number): Promise<boolean> {
        let instance: ItemInstance = await this.getInstance(instanceID);
        if (amount > instance.amount) amount = instance.amount;
        else if (amount <= 0) amount = 1;
        await this.add(instance.itemRef.ID, inventoryID, amount);
        await this.remove(instance.ID, amount);
        return Promise.resolve(true);
    }

    async getMaxDepth(inventoryID: number): Promise<number> {
        return Math.ceil(await this.getItemCount(inventoryID) / 8.0);
    }

    async getInstances(inventoryID: number): Promise<ItemInstance[]> {
        let __instances: ItemInstance[] = this.__instances.filter(instance => instance.inventoryID == inventoryID);
        __instances.forEach(async element => {
            element.itemRef = await this.itemRepo.getItem(element.itemID);
        });
        return Promise.resolve<ItemInstance[]>(__instances);
    }

    async remove(instanceID: number, amount?: number): Promise<Item> {
        let instance: ItemInstance = await this.getInstance(instanceID);
        if (!instance) throw new Error(`❌ Chester couldn't find this item!`);
        if (instance && (!amount || instance.amount - amount <= 0)) this.__instances = this.__instances.filter(ins => ins.ID != instanceID); //Delete the entire stack.
        else instance.amount -= amount;
        return Promise.resolve(instance.itemRef);
    }
    async getInstance(instanceID: number): Promise<ItemInstance | null> {
        let instance: ItemInstance = this.__instances.find(ins => ins.ID == instanceID);
        instance.itemRef = await this.itemRepo.getItem(instance.itemID);
        return Promise.resolve(this.__instances.find(ins => ins.ID == instanceID));
    }
    getTotalWeight(inventoryID: number): Promise<number> {
        let filtered: Array<ItemInstance> = this.__instances.filter(ins => ins.inventoryID == inventoryID);
        let total: number = 0;
        for (let instance of filtered) total += instance.amount * instance.itemRef.weight;
        return Promise.resolve(total);
    }
    
    getTotalItemValue(inventoryID: number): Promise<number> {
        let filtered: Array<ItemInstance> = this.__instances.filter(ins => ins.inventoryID == inventoryID);
        let total: number = 0;
        for (let instance of filtered) total += instance.amount * instance.itemRef.value;
        return Promise.resolve(total);
    }

    getItemCount(inventoryID: number): Promise<number> {
        return Promise.resolve(this.__instances.filter(ins => ins.inventoryID == inventoryID).length);
    }

    getInventory(inventoryID: number): Promise<Inventory> {
        return Promise.resolve(this.__inventories.find((inv) => inv.ID == inventoryID));
    }
    async getInventoryByGuildUser(discordGuildID: string, discordUserID: string): Promise<Inventory> {
        let guildUser: GuildUser = await this.guildRepo.getGuildUserByDiscordID(discordGuildID, discordUserID);
        let inventory: Inventory = this.__inventories.find((inv) => inv.guildUserID == guildUser.ID);
        if (!inventory) inventory = await this.createInventory(discordGuildID, discordUserID, 0);
        return Promise.resolve(inventory);
    }

    async findInstanceByItemID(itemID: number, inventoryID: number): Promise<ItemInstance> {
        return Promise.resolve(this.__instances.find(ins => ins.itemID == itemID && ins.inventoryID == inventoryID));
    }

}