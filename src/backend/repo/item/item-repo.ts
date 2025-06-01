import { ResultSetHeader, RowDataPacket } from "mysql2";
import { DbManager } from "../../db/db-manager";
import { ENV, SCOPE } from "../../injection/container";
import { injectable, InjectionContainer } from "../../injection/injector";
import { Item, ITEM_FIELDS } from "../../models/item";
import { BaseRepo } from "../base-repo";
import { IitemRepo, ITEM_REPO_KEY } from "./i-item-repo";
import { GUILD_REPO_KEY, IGuildRepo } from "../guild/i-guild-repo";
import { GuildModel } from "../../models/guild";

@injectable([ENV.Live], SCOPE.Transient, ITEM_REPO_KEY)
export class ItemRepo extends BaseRepo implements IitemRepo {
    private guildRepo: IGuildRepo;
    constructor(manager: DbManager) {
        super(manager);
        this.guildRepo = new InjectionContainer().get<IGuildRepo>(GUILD_REPO_KEY);
    }
    async getItem(itemID: number): Promise<Item | null> {
        const sql: string = `SELECT * FROM ${Item.getTableName()} WHERE ${Item.getColumnName(ITEM_FIELDS.ID)} = ? LIMIT 1;`;
        const values: Array<any> = [itemID];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let item: Item;
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(async result => {
            if (result[0].length > 0) {
                let row: RowDataPacket = result[0][0];
                item = new Item(
                    row[Item.getColumnName(ITEM_FIELDS.GuildID)],
                    row[Item.getColumnName(ITEM_FIELDS.ItemName)],
                    row[Item.getColumnName(ITEM_FIELDS.Secret)],
                    row[Item.getColumnName(ITEM_FIELDS.CreationDate)],
                    row[Item.getColumnName(ITEM_FIELDS.ItemDescription)],
                    row[Item.getColumnName(ITEM_FIELDS.ItemResume)],
                    row[Item.getColumnName(ITEM_FIELDS.Effect)],
                    row[Item.getColumnName(ITEM_FIELDS.Weight)],
                    row[Item.getColumnName(ITEM_FIELDS.ItemValue)],
                    await this.guildRepo.getGuildByID(row[Item.getColumnName(ITEM_FIELDS.GuildID)]),
                    row[Item.getColumnName(ITEM_FIELDS.ID)]
                );
            } else item = null;
        });
        if (!item) throw new Error('Could not find the specified ID');
        return item;
    }
    async getItemByName(discordGuildID: string, itemName: string): Promise<Item | null> {
        let guild: GuildModel = await this.guildRepo.getGuildByDiscordID(discordGuildID);
        const sql: string = `SELECT * FROM ${Item.getTableName()} WHERE ${Item.getColumnName(ITEM_FIELDS.GuildID)} = ? 
        AND ${Item.getColumnName(ITEM_FIELDS.ItemName)} LIKE ? LIMIT 1;`;
        const values: Array<any> = [guild.ID, '%'+itemName+'%'];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let item: Item;
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(result => {
            if (result[0].length > 0) {
                let row: RowDataPacket = result[0][0];
                item = new Item(
                    row[Item.getColumnName(ITEM_FIELDS.GuildID)],
                    row[Item.getColumnName(ITEM_FIELDS.ItemName)],
                    row[Item.getColumnName(ITEM_FIELDS.Secret)],
                    row[Item.getColumnName(ITEM_FIELDS.CreationDate)],
                    row[Item.getColumnName(ITEM_FIELDS.ItemDescription)],
                    row[Item.getColumnName(ITEM_FIELDS.ItemResume)],
                    row[Item.getColumnName(ITEM_FIELDS.Effect)],
                    row[Item.getColumnName(ITEM_FIELDS.Weight)],
                    row[Item.getColumnName(ITEM_FIELDS.ItemValue)],
                    guild,
                    row[Item.getColumnName(ITEM_FIELDS.ID)]
                );
            } else item = null;
        });
        if (!item) throw new Error(`❌ Could not find any item named "${itemName}"`);
        return item;
    }
    async createItem(item: Item): Promise<Item> {
        const sql: string = `INSERT INTO ${Item.getTableName()}(
        ${Item.getColumnName(ITEM_FIELDS.GuildID)},
        ${Item.getColumnName(ITEM_FIELDS.ItemName)},
        ${Item.getColumnName(ITEM_FIELDS.ItemDescription)},
        ${Item.getColumnName(ITEM_FIELDS.ItemResume)},
        ${Item.getColumnName(ITEM_FIELDS.Effect)},
        ${Item.getColumnName(ITEM_FIELDS.ItemValue)},
        ${Item.getColumnName(ITEM_FIELDS.Weight)},
        ${Item.getColumnName(ITEM_FIELDS.Secret)},
        ${Item.getColumnName(ITEM_FIELDS.CreationDate)}
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        const values: Array<any> = [item.guildID, item.name, item.description, item.resume, item.effect, item.value, item.weight, item.secret, new Date()];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        await (await this.__sqlManager.getConnectionPool()).execute<ResultSetHeader>(sql, values).then(async result => {
            item = await this.getItem(result[0].insertId);
        });
        return item;
    }
    async updateItem(itemID: number, model: Item): Promise<Item> {
        const oldItem: Item = await this.getItem(itemID);
        if (!oldItem) throw new Error('Could not find that item by its ID'); 
        const values: Array<any> = [];
        let updateFields: string = ``;
        for (let i = 2; i < Object.values(ITEM_FIELDS).length; i++){
            if (oldItem.getByEnum(i)!=model.getByEnum(i)){
                updateFields += `${ITEM_FIELDS[i]} = ?,`;
                values.push(model.getByEnum(i));
            }
        }
        if (values.length < 1) throw new Error('No value got changed for UPDATE clausure.');
        values.push(itemID);
        updateFields = updateFields.substring(0, updateFields.length - 1);
        const sql: string = `UPDATE ${Item.getTableName()} SET ${updateFields} WHERE ${Item.getColumnName(ITEM_FIELDS.ID)} = ?`;
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let updated: boolean = false;
        await (await this.__sqlManager.getConnectionPool()).execute<ResultSetHeader>(sql, values).then(async result => {
            updated = result[0].affectedRows > 0;
        });
        if (updated) return model;
    }
    async deleteItem(itemID: number): Promise<boolean> {
        let item: Item = await this.getItem(itemID); 
        const sql: string = `DELETE FROM ${Item.getTableName()} WHERE ${Item.getColumnName(ITEM_FIELDS.ID)} = ?;`;
        const values: Array<any> = [itemID];
        let deleted: boolean = false;
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        await (await this.__sqlManager.getConnectionPool()).execute<ResultSetHeader>(sql, values).then(result => {
            deleted = result[0].affectedRows > 0;
        });
        return deleted;
    }
    async getItemsByDepth(discordGuildID: string, depth: number, sorting?: number): Promise<Map<number, Item>> {
        let guild: GuildModel = await this.guildRepo.getGuildByDiscordID(discordGuildID);
        let max_depth: number = await this.getMaxDepth(guild.ID);
        depth = depth > max_depth ? max_depth : depth < 1 ? 1 : depth;
        const sql: string = `SELECT * FROM ${Item.getTableName()} WHERE ${Item.getColumnName(ITEM_FIELDS.GuildID)} = ? ORDER BY ${Item.getColumnName(ITEM_FIELDS.ItemName)} ${sorting && sorting < 0 ? 'ASC' : 'DESC'} LIMIT ? OFFSET ?;`;
        const values: Array<any> = [guild.ID, 8, Math.abs((depth - 1) * 8)];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let items: Map<number, Item> = new Map<number, Item>();
        await (await this.__sqlManager.getConnectionPool()).query<RowDataPacket[]>(sql, values).then(result => {
            if (result[0].length > 0) {
                for (let i = 0; i < result[0].length; i++) {
                    let row: RowDataPacket = result[0][i];
                    items.set(i, new Item(
                        row[Item.getColumnName(ITEM_FIELDS.GuildID)],
                        row[Item.getColumnName(ITEM_FIELDS.ItemName)],
                        row[Item.getColumnName(ITEM_FIELDS.Secret)],
                        row[Item.getColumnName(ITEM_FIELDS.CreationDate)],
                        row[Item.getColumnName(ITEM_FIELDS.ItemDescription)],
                        row[Item.getColumnName(ITEM_FIELDS.ItemResume)],
                        row[Item.getColumnName(ITEM_FIELDS.Effect)],
                        row[Item.getColumnName(ITEM_FIELDS.Weight)],
                        row[Item.getColumnName(ITEM_FIELDS.ItemValue)],
                        guild,
                        row[Item.getColumnName(ITEM_FIELDS.ID)]
                    ));
                }
            }
        });
        return items;
    }
    async getItemsFromAutocomplete(discordGuildID: string, query: string): Promise<Item[]> {
        if (query.length <= 2) return [];
        let guild: GuildModel = await this.guildRepo.getGuildByDiscordID(discordGuildID);
        const sql: string = `SELECT * FROM ${Item.getTableName()} WHERE ${Item.getColumnName(ITEM_FIELDS.GuildID)} = ? 
        AND LOWER(${Item.getColumnName(ITEM_FIELDS.ItemName)}) LIKE ? LIMIT 25;`;
        const values: Array<any> = [guild.ID, '%'+query.trim().toLowerCase()+'%'];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let items: Item[] = [];
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(result => {
            if (result[0].length > 0) {
                for (let i = 0; i < result[0].length; i++) {
                    let row: RowDataPacket = result[0][i];
                    items.push(new Item(
                        row[Item.getColumnName(ITEM_FIELDS.GuildID)],
                        row[Item.getColumnName(ITEM_FIELDS.ItemName)],
                        row[Item.getColumnName(ITEM_FIELDS.Secret)],
                        row[Item.getColumnName(ITEM_FIELDS.CreationDate)],
                        row[Item.getColumnName(ITEM_FIELDS.ItemDescription)],
                        row[Item.getColumnName(ITEM_FIELDS.ItemResume)],
                        row[Item.getColumnName(ITEM_FIELDS.Effect)],
                        row[Item.getColumnName(ITEM_FIELDS.Weight)],
                        row[Item.getColumnName(ITEM_FIELDS.ItemValue)],
                        guild,
                        row[Item.getColumnName(ITEM_FIELDS.ID)]
                    ));
                }
            }
        });
        return items;
    }
    async getMaxDepth(guildID: number): Promise<number> {
        const sql: string = `SELECT COUNT(${Item.getColumnName(ITEM_FIELDS.ID)}) AS total FROM ${Item.getTableName()} WHERE ${Item.getColumnName(ITEM_FIELDS.GuildID)} = ?;`;
        const values: Array<any> = [guildID];
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        let maxDepth: number;
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(result => {
            let count: number = result[0][0]['total'];
            maxDepth = Math.ceil(count / 8.0);
        });
        return maxDepth;
    }
}