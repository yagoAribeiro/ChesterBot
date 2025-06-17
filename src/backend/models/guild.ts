import { StringSelectMenuOptionBuilder } from "discord.js";
import { RowDataPacket } from "mysql2";
import { DataModel } from "./i-data-model";

export enum GUILD_FIELDS {
    ID,
    DiscordID
}

export class GuildModel implements DataModel<GuildModel, GUILD_FIELDS> {
    ID?: number;
    discordID: string;

    constructor(discordID: string, ID?: number) {
        this.discordID = discordID
        this.ID = ID;
    }
    static getColumnName(index: GUILD_FIELDS): string {
        return GUILD_FIELDS[index];
    }
    getByEnum(index: GUILD_FIELDS) {
        switch (index) {
            case GUILD_FIELDS.ID: return this.ID;
            case GUILD_FIELDS.DiscordID: return this.discordID;
        }
    }

    static getTableName(): string {
        return "guild";
    }

    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder> {
        throw new Error("Method not implemented.");
    }
    compareTo(b: GuildModel): number {
        throw new Error("Method not implemented.");
    }

}