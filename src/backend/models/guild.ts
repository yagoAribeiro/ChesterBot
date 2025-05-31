import { StringSelectMenuOptionBuilder } from "discord.js";
import { RowDataPacket } from "mysql2";
import { DataModel } from "./i-data-model";

export enum GUILD_FIELDS{
    id,
    discordID
}

export class GuildModel implements DataModel<GuildModel, GUILD_FIELDS>{
    ID?: number;
    discordID: string;

    constructor(discordID: string, ID?: number){
        this.discordID = discordID
        this.ID = ID;
    }
    getByEnum(index: GUILD_FIELDS) {
        switch(index){
            case GUILD_FIELDS.id: return this.ID;
            case GUILD_FIELDS.discordID: return this.discordID;
        }
    }

    static fromDbRow(row: RowDataPacket): GuildModel {
        return new GuildModel(row[0]["DiscordID"] as string, row[0]["ID"] as number);
    }
    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder> {
        throw new Error("Method not implemented.");
    }
    compareTo(b: GuildModel): number {
        throw new Error("Method not implemented.");
    }
    
}