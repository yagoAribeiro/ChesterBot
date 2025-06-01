import { ResultSetHeader, RowDataPacket } from "mysql2";
import { DbManager } from "../../db/db-manager";
import { ENV, SCOPE } from "../../injection/container";
import { injectable, InjectionContainer } from "../../injection/injector";
import { GuildUser } from "../../models/guildUser";
import { Inventory, INVENTORY_FIELDS, INVENTORY_TYPES } from "../../models/inventory";
import { Item, ITEM_FIELDS } from "../../models/item";
import { ITEM_INSTANCE_FIELDS, ItemInstance } from "../../models/item-instance";
import { BaseRepo } from "../base-repo";
import { GUILD_REPO_KEY, IGuildRepo } from "../guild/i-guild-repo";
import { IinventoryRepo, INVENTORY_REPO_KEY } from "./i-inventory-repo";
import { IitemRepo, ITEM_REPO_KEY } from "../item/i-item-repo";

@injectable([ENV.Live], SCOPE.Transient, INVENTORY_REPO_KEY)
export class InventoryRepo extends BaseRepo implements IinventoryRepo {
    private guildRepo: IGuildRepo;
    private itemRepo: IitemRepo;
    constructor(manager: DbManager) {
        super(manager);
        this.guildRepo = new InjectionContainer().get<IGuildRepo>(GUILD_REPO_KEY);
        this.itemRepo = new InjectionContainer().get<IitemRepo>(ITEM_REPO_KEY);
    }

    async add(itemID: number, inventoryID: number, amount: number): Promise<Item> {
        let sql: string = ``;
        let values: Array<any> = [];
        let instance: ItemInstance = await this.findInstanceByItemID(itemID, inventoryID);
        if (!instance) {
            sql = `INSERT INTO ${ItemInstance.getTableName()}(
            ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ItemID)},
            ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InventoryID)},
            ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InstanceIndex)},
            ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.Amount)},
            ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.LastUpdate)}) VALUES (?, ?, ?, ?, ?);`;
            values.push(itemID, inventoryID, 0, amount, new Date());
        } else {
            sql = `UPDATE ${ItemInstance.getTableName()} SET ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.Amount)} = ? 
            WHERE ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ID)} = ?;`;
            values.push(instance.amount + amount, instance.ID);
        }
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let itemRef: Item;
        await (await this.__sqlManager.getConnectionPool()).execute<ResultSetHeader>(sql, values).then(async result => {
            if (result[0].affectedRows > 0) {
                itemRef = await this.itemRepo.getItem(itemID);
            }
        });
        return itemRef;
    }
    async remove(instanceID: number, amount: number): Promise<Item> {
        let sql: string = ``;
        let values: Array<any> = [];
        let instance: ItemInstance = await this.getInstance(instanceID);
        if (instance.amount - amount <= 0) {
            sql = `DELETE FROM ${ItemInstance.getTableName()} WHERE ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ID)} = ?`;
            values.push(instance.ID);
        } else {
            sql = `UPDATE ${ItemInstance.getTableName()} SET ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.Amount)} = ? 
            WHERE ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ID)} = ?;`;
            values.push(instance.amount - amount, instance.ID);
        }
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let itemRef: Item;
        await (await this.__sqlManager.getConnectionPool()).execute<ResultSetHeader>(sql, values).then(result => {
            if (result[0].affectedRows > 0) {
                itemRef = instance.itemRef;
            }
        });
        return itemRef;
    }
    async give(inventoryID: number, instanceID: number, amount?: number): Promise<boolean> {
        let item: Item = await this.remove(instanceID, amount);
        if (item) item = await this.add(item.ID, inventoryID, amount);
        return item != null;
    }
    async update(inventoryID: number, currency?: number, maxWeight?: number): Promise<Inventory> {
        let inventory: Inventory = await this.getInventory(inventoryID);
        if (!currency && !maxWeight) throw new Error('You must update something!');
        const values: Array<any> = [];
        let updateFields: string = ``;
        if (currency){
            updateFields += `${Inventory.getColumnName(INVENTORY_FIELDS.Currency)} = ?,`;
            values.push(currency);
        }
        if (maxWeight){
            updateFields += `${Inventory.getColumnName(INVENTORY_FIELDS.MaxWeight)} = ?,`;
            values.push(maxWeight);
        }
        updateFields = updateFields.substring(0, updateFields.length-1);
        values.push(inventoryID);
        const sql: string = `UPDATE ${Inventory.getTableName()} SET ${updateFields} WHERE ${Inventory.getColumnName(INVENTORY_FIELDS.ID)} = ?`;
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let updated: boolean = false;
        await (await this.__sqlManager.getConnectionPool()).execute<ResultSetHeader>(sql, values).then(async result => {
            updated = result[0].affectedRows > 0;
        });
        if (updated) return await this.getInventory(inventoryID);
    }

    async createInventory(discordGuildID: string, discordUserID: string, type: INVENTORY_TYPES): Promise<Inventory> {
        let guildUser: GuildUser = await this.guildRepo.getGuildUserByDiscordID(discordGuildID, discordUserID);
        const sql: string = `INSERT INTO ${Inventory.getTableName()}(${Inventory.getColumnName(INVENTORY_FIELDS.GuildUserID)}, 
        ${Inventory.getColumnName(INVENTORY_FIELDS.InventoryType)}, ${Inventory.getColumnName(INVENTORY_FIELDS.Currency)}, 
        ${Inventory.getColumnName(INVENTORY_FIELDS.MaxWeight)}) VALUES (?, ?, ?, ?)`;
        const values: Array<any> = [guildUser.ID, type, 0, 10];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let inventory: Inventory;
        await (await this.__sqlManager.getConnectionPool()).execute<ResultSetHeader>(sql, values).then(async result => {
            inventory = await this.getInventory(result[0].insertId);
        });
        return inventory;
    }
    async getInventory(inventoryID: number): Promise<Inventory> {
        const sql: string = `SELECT * FROM ${Inventory.getTableName()} WHERE ${Inventory.getColumnName(INVENTORY_FIELDS.ID)} = ? LIMIT 1;`;
        const values: Array<any> = [inventoryID];
        let inventory: Inventory;
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(async result => {
            if (result[0].length > 0) {
                let row: RowDataPacket = result[0][0];
                inventory = new Inventory(row[Inventory.getColumnName(INVENTORY_FIELDS.GuildUserID)],
                    row[Inventory.getColumnName(INVENTORY_FIELDS.InventoryType)],
                    row[Inventory.getColumnName(INVENTORY_FIELDS.Currency)],
                    row[Inventory.getColumnName(INVENTORY_FIELDS.MaxWeight)],
                    row[Inventory.getColumnName(INVENTORY_FIELDS.CustomIdentifier)],
                    row[Inventory.getColumnName(INVENTORY_FIELDS.CustomDescription)],
                    await this.guildRepo.getGuildUserByID(row[Inventory.getColumnName(INVENTORY_FIELDS.GuildUserID)]),
                    row[Inventory.getColumnName(INVENTORY_FIELDS.ID)]);
            } else inventory = null;
        });
        if (!inventory) throw new Error('Could not find the specified ID');
        return inventory;
    }
    async getInstance(instanceID: number): Promise<ItemInstance | null> {
        const sql: string = `SELECT * FROM ${ItemInstance.getTableName()} WHERE ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ID)} = ? LIMIT 1;`;
        const values: Array<any> = [instanceID];
        let instance: ItemInstance;
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(async result => {
            if (result[0].length > 0) {
                let row: RowDataPacket = result[0][0];
                instance = new ItemInstance(
                    row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InventoryID)],
                    row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ItemID)],
                    row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.Amount)],
                    row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InstanceIndex)],
                    new Date(),
                    await this.itemRepo.getItem(row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ItemID)]),
                    row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ID)]);
            } else instance = null;
        });
        if (!instance) throw new Error('Could not find the specified ID');
        return instance;
    }

    async findInstanceByItemID(itemID: number, inventoryID: number): Promise<ItemInstance> {
        const sql: string = `SELECT * FROM ${ItemInstance.getTableName()} 
        WHERE ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ItemID)} = ? AND ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InventoryID)} = ? LIMIT 1;`;
        const values: Array<any> = [itemID, inventoryID];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let instance: ItemInstance;
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(async result => {
            if (result[0].length > 0) {
                let row: RowDataPacket = result[0][0];
                instance = new ItemInstance(
                    row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InventoryID)],
                    row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ItemID)],
                    row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.Amount)],
                    row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InstanceIndex)],
                    new Date(),
                    await this.itemRepo.getItem(row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ItemID)]),
                    row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ID)]);
            } else instance = null;
        });
        return instance;

    }
    async getInventoryByGuildUser(discordGuildID: string, discordUserID: string): Promise<Inventory> {
        let guildUser: GuildUser = await this.guildRepo.getGuildUserByDiscordID(discordGuildID, discordUserID);
        const sql: string = `SELECT * FROM ${Inventory.getTableName()} 
        WHERE ${Inventory.getColumnName(INVENTORY_FIELDS.GuildUserID)} = ? LIMIT 1;`;
        const values: Array<any> = [guildUser.ID];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let inventory: Inventory;
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(result => {
            if (result[0].length > 0) {
                let row: RowDataPacket = result[0][0];
                inventory = new Inventory(
                    row[Inventory.getColumnName(INVENTORY_FIELDS.GuildUserID)],
                    row[Inventory.getColumnName(INVENTORY_FIELDS.InventoryType)],
                    row[Inventory.getColumnName(INVENTORY_FIELDS.Currency)],
                    row[Inventory.getColumnName(INVENTORY_FIELDS.MaxWeight)],
                    row[Inventory.getColumnName(INVENTORY_FIELDS.CustomIdentifier)],
                    row[Inventory.getColumnName(INVENTORY_FIELDS.CustomDescription)],
                    guildUser,
                    row[Inventory.getColumnName(INVENTORY_FIELDS.ID)]
                );
            } else inventory = null;
        });
        if (!inventory) inventory = await this.createInventory(discordGuildID, discordUserID, 0);
        return inventory;
    }
    getInstances(inventoryID: number): Promise<ItemInstance[]> {
        throw new Error("Method not implemented.");
    }
    async getInstancesAutocomplete(inventoryID: number, query: string): Promise<ItemInstance[]> {
        if (query.length <= 2) return [];
        const sql: string = `SELECT t1.* FROM ${ItemInstance.getTableName()} AS t1 INNER JOIN ${Item.getTableName()} AS t2
                ON t2.${Item.getColumnName(ITEM_FIELDS.ID)} = t1.${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ItemID)}
                WHERE ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InventoryID)} = ? 
                AND LOWER(t2.${Item.getColumnName(ITEM_FIELDS.ItemName)}) LIKE ? LIMIT 25;`;
        const values: Array<any> = [inventoryID, '%' + query.trim().toLowerCase() + '%'];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let instances: ItemInstance[] = [];
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(async result => {
            if (result[0].length > 0) {
                for (let i = 0; i < result[0].length; i++) {
                    let row: RowDataPacket = result[0][i];
                    instances.push(new ItemInstance(
                        row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InventoryID)],
                        row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ItemID)],
                        row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.Amount)],
                        row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InstanceIndex)],
                        new Date(),
                        await this.itemRepo.getItem(row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ItemID)]),
                        row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ID)])
                    );
                }
            }
        });
        return instances;
    }
    async getInstancesByDepth(inventoryID: number, depth: number): Promise<Map<number, ItemInstance>> {
        let max_depth: number = await this.getMaxDepth(inventoryID);
        depth = depth > max_depth ? max_depth : depth < 1 ? 1 : depth;
        const sql: string = `SELECT * FROM ${ItemInstance.getTableName()} WHERE ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InventoryID)} = ? LIMIT ? OFFSET ?;`;
        const values: Array<any> = [inventoryID, 8, Math.abs((depth - 1) * 8)];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let instances: Map<number, ItemInstance> = new Map<number, ItemInstance>();
        await (await this.__sqlManager.getConnectionPool()).query<RowDataPacket[]>(sql, values).then(async result => {
            if (result[0].length > 0) {
                for (let i = 0; i < result[0].length; i++) {
                    let row: RowDataPacket = result[0][i];
                    instances.set(i, new ItemInstance(
                        row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InventoryID)],
                        row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ItemID)],
                        row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.Amount)],
                        row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InstanceIndex)],
                        new Date(),
                        await this.itemRepo.getItem(row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ItemID)]),
                        row[ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ID)])
                    );
                }
            }
        });
        return instances;
    }
    async getMaxDepth(inventoryID: number): Promise<number> {
        const sql: string = `SELECT COUNT(${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ID)}) AS total FROM ${ItemInstance.getTableName()} WHERE ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InventoryID)} = ?;`;
        const values: Array<any> = [inventoryID];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let maxDepth: number;
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(result => {
            let count: number = result[0][0]['total'];
            maxDepth = Math.ceil(count / 8.0);
        });
        return maxDepth;
    }
    async getItemCount(inventoryID: number): Promise<number> {
        const sql: string = `SELECT COUNT(${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ID)}) AS total 
        FROM ${ItemInstance.getTableName()} WHERE ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InventoryID)} = ?;`;
        const values: Array<any> = [inventoryID];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let count: number;
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(result => {
            count = result[0][0]['total'];
        });
        return count;
    }
    async getTotalWeight(inventoryID: number): Promise<number> {
        const sql: string = `SELECT SUM(t1.${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.Amount)} * t2.${Item.getColumnName(ITEM_FIELDS.Weight)}) AS total 
        FROM ${ItemInstance.getTableName()} AS t1 INNER JOIN ${Item.getTableName()} AS t2
        ON t2.${Item.getColumnName(ITEM_FIELDS.ID)} = t1.${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ItemID)}
        WHERE ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InventoryID)} = ?;`;
        const values: Array<any> = [inventoryID];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let totalWeight: number;
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(result => {
            totalWeight = result[0][0]['total'];
        });
        return totalWeight;
    }

    async getTotalItemValue(inventoryID: number): Promise<number> {
        const sql: string = `SELECT SUM(t1.${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.Amount)} * t2.${Item.getColumnName(ITEM_FIELDS.ItemValue)}) AS total 
        FROM ${ItemInstance.getTableName()} AS t1 INNER JOIN ${Item.getTableName()} AS t2
        ON t2.${Item.getColumnName(ITEM_FIELDS.ID)} = t1.${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.ItemID)}
        WHERE ${ItemInstance.getColumnName(ITEM_INSTANCE_FIELDS.InventoryID)} = ?;`;
        const values: Array<any> = [inventoryID];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let totalValue: number;
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(result => {
            totalValue = result[0][0]['total'];
        });
        return totalValue;
    }
}