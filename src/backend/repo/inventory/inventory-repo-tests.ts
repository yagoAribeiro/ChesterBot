import { ENV, SCOPE } from "../../injection/container";
import { injectable } from "../../injection/injector";
import { Inventory } from "../../models/inventory";
import { ItemInstance } from "../../models/item-instance";
import { AppConfig } from "../../utils/app-config";
import { IinventoryRepo, INVENTORY_REPO_KEY } from "./i-inventory-repo";
import { IitemRepo } from "../item/i-item-repo";

@injectable([ENV.Tests], SCOPE.Singleton, INVENTORY_REPO_KEY)
export class InventoryRepoTests implements IinventoryRepo{
    private itemRepo: IitemRepo;
    private inventories: Inventory[];
    private instances: ItemInstance[];

    constructor(config: AppConfig, itemRepo: IitemRepo){
        this.inventories.push(new Inventory(config.guildDevID, 0, '343586591542870018', 1));
        this.itemRepo = itemRepo;
    }
    createInventory(guildID: string, userID: string, type: number): Promise<boolean> {
        this.inventories.push(new Inventory(guildID, type, userID));
        return Promise.resolve(true);
    }
    async add(itemID: number, inventoryID: number, amount: number): Promise<boolean> {
        let instance: ItemInstance = await this.getInstance(itemID);
        if (instance) instance.amount += amount;
        else this.instances.push(new ItemInstance(inventoryID, itemID, amount, 0, new Date(), this.instances.length));
        return Promise.resolve(true);
    }

    async remove(instanceID: number, amount: number): Promise<boolean> {
        let instance: ItemInstance = await this.getInstance(instanceID);
        if (instance && instance.amount - amount <= 0) this.instances = this.instances.filter(ins => ins.ID != instanceID);
        else instance.amount -= amount;
        return Promise.resolve(true);
    }
    getInstance(instanceID: number): Promise<ItemInstance> {
      return Promise.resolve(this.instances.find(ins => ins.ID == instanceID));
    }
    getTotalWeight(inventoryID: number): Promise<number> {
      let filtered: Array<ItemInstance> = this.instances.filter(ins => ins.inventoryID == inventoryID); 
      let total: number = 0;
      for (let instance of filtered) total += instance.amount * instance.itemRef.weight;
      return Promise.resolve(total);
    }
    getInventoriesByDepth(guildID: number, depth: number): Promise<Map<number, Inventory>> {
        throw new Error("Method not implemented.");
    }
    getItemCount(inventoryID: number): Promise<number> {
        return Promise.resolve(this.instances.filter(ins => ins.inventoryID == inventoryID).length);
    }
    clear(inventoryID: number): Promise<boolean> {
        this.instances = this.instances.filter(ins => ins.inventoryID!=inventoryID);
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
    getInventoryByGuildUser(guildID: string, userID: string): Promise<Inventory> {
       return Promise.resolve(this.inventories.find((inv) => inv.guildID == guildID && inv.userID == userID));
    }

    async findInstanceByItemID(itemID: number, inventoryID: number) : Promise<ItemInstance>{
        return Promise.resolve(this.instances.find(ins => ins.itemID == itemID && ins.inventoryID == inventoryID));
    }
    
   async loadItem(instance: ItemInstance) : Promise<void>{
        instance.itemRef = await this.itemRepo.getItem(instance.itemID);
    }
}