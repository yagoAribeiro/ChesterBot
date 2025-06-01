import { ResultSetHeader, RowDataPacket } from "mysql2";
import { DbManager } from "../../db/db-manager";
import { ENV, SCOPE } from "../../injection/container";
import { injectable } from "../../injection/injector";
import { GUILD_FIELDS, GuildModel } from "../../models/guild";
import { GUILD_USER_FIELDS, GuildUser } from "../../models/guildUser";
import { BaseRepo } from "../base-repo";
import { GUILD_REPO_KEY, IGuildRepo } from "./i-guild-repo";

@injectable([ENV.Live], SCOPE.Transient, GUILD_REPO_KEY)
export class GuildRepo extends BaseRepo implements IGuildRepo {
    constructor(manager: DbManager) {
        super(manager);
    }
    async getGuildByDiscordID(discordGuildID: string): Promise<GuildModel> {
        const sql: string = `SELECT * FROM ${GuildModel.getTableName()} WHERE ${GuildModel.getColumnName(GUILD_FIELDS.DiscordID)} = ? LIMIT 1;`;
        const values: Array<any> = [discordGuildID];
        let guild: GuildModel;
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(result => {
            if (result[0].length > 0) {
                let row: RowDataPacket = result[0][0];
                guild = new GuildModel(
                    row[GuildModel.getColumnName(GUILD_FIELDS.DiscordID)],
                    row[GuildModel.getColumnName(GUILD_FIELDS.ID)]);
            } else guild = null;
        });
        if (!guild) guild = await this.createGuild(discordGuildID);
        return guild;
    }
    async getGuildByID(ID: number): Promise<GuildModel | null> {
        const sql: string = `SELECT * FROM ${GuildModel.getTableName()} WHERE ${GuildModel.getColumnName(GUILD_FIELDS.ID)} = ? LIMIT 1;`;
        const values: Array<any> = [ID];
        let guild: GuildModel;
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(result => {
            if (result[0].length > 0) {
                let row: RowDataPacket = result[0][0];
                guild = new GuildModel(
                    row[GuildModel.getColumnName(GUILD_FIELDS.DiscordID)],
                    row[GuildModel.getColumnName(GUILD_FIELDS.ID)]);
            } else guild = null;
        });
        if (!guild) throw new Error('Could not find the specified ID');
        return guild;
    }
    async createGuild(discordGuildID: string): Promise<GuildModel> {
        const sql: string = `INSERT INTO ${GuildModel.getTableName()}(${GuildModel.getColumnName(GUILD_FIELDS.DiscordID)}) VALUES (?);`;
        const values: Array<any> = [discordGuildID];
        let guild: GuildModel;
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        await (await this.__sqlManager.getConnectionPool()).execute<ResultSetHeader>(sql, values).then(async result => {
            guild = await this.getGuildByID(result[0].insertId);
        });
        return guild;
    }
    async createGuildUser(guildID: number, discordUserID: string): Promise<GuildUser> {
        const sql: string = `INSERT INTO ${GuildUser.getTableName()}(${GuildUser.getColumnName(GUILD_USER_FIELDS.GuildID)}, ${GuildUser.getColumnName(GUILD_USER_FIELDS.DiscordID)}) VALUES (?, ?);`;
        const values: Array<any> = [guildID, discordUserID];
        let guildUser: GuildUser;
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        await (await this.__sqlManager.getConnectionPool()).execute<ResultSetHeader>(sql, values).then(async result => {
            guildUser = await this.getGuildUserByID(result[0].insertId);
        });
        return guildUser;
    }
    async getGuildUserByDiscordID(discordGuildID: string, discordUserID: string): Promise<GuildUser> {
        let guild: GuildModel = await this.getGuildByDiscordID(discordGuildID);
        const sql: string = `SELECT * FROM ${GuildUser.getTableName()} 
        WHERE ${GuildUser.getColumnName(GUILD_USER_FIELDS.DiscordID)} = ? AND ${GuildUser.getColumnName(GUILD_USER_FIELDS.GuildID)} = ? 
        LIMIT 1;`;
        const values: Array<any> = [discordUserID, guild.ID];
        let guildUser: GuildUser;
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(result => {
            if (result[0].length > 0) {
                let row: RowDataPacket = result[0][0];
                guildUser = new GuildUser(row[GuildUser.getColumnName(GUILD_USER_FIELDS.GuildID)],
                    row[GuildUser.getColumnName(GUILD_USER_FIELDS.DiscordID)],
                    guild,
                    row[GuildUser.getColumnName(GUILD_USER_FIELDS.ID)],);
            } else guildUser = null;
        });
        if (!guildUser) guildUser = await this.createGuildUser(guild.ID, discordUserID);
        return guildUser;
    }
    async getGuildUserByID(ID: number): Promise<GuildUser | null> {
        const sql: string = `SELECT * FROM ${GuildUser.getTableName()} WHERE ${GuildUser.getColumnName(GUILD_USER_FIELDS.ID)} = ? LIMIT 1;`;
        const values: Array<any> = [ID];
        let guildUser: GuildUser;
        console.log(`[SQL] -> ${sql}\n[VALUES] -> ${values.toString()}`);
        await (await this.__sqlManager.getConnectionPool()).execute<RowDataPacket[]>(sql, values).then(async result => {
            if (result[0].length > 0) {
                let row: RowDataPacket = result[0][0];
                guildUser = new GuildUser(
                    row[GuildUser.getColumnName(GUILD_USER_FIELDS.GuildID)],
                    row[GuildUser.getColumnName(GUILD_USER_FIELDS.DiscordID)],
                    await this.getGuildByID(row[GuildUser.getColumnName(GUILD_USER_FIELDS.GuildID)]),
                    row[GuildUser.getColumnName(GUILD_USER_FIELDS.ID)]);
            } else guildUser = null;
        });
        if (!guildUser) throw new Error('Could not find the specified ID');
        return guildUser;
    }

}