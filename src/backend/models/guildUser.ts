import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";
import { GuildModel } from "./guild";

export enum GUILD_USER_FIELDS{
    id,
    guildID,
    discordID,
}

export class GuildUser implements DataModel<GuildUser, GUILD_USER_FIELDS>{
    ID?: number;
    guildID: number;
    discordID?: string;
    guildRef?: GuildModel;

    constructor(guildID: number, discordID?: string, guildRef?: GuildModel, ID?: number){
        this.ID = ID;
        this.guildID = guildID;
        this.discordID = discordID;
        this.guildRef = guildRef;
    }
    getByEnum(index: GUILD_USER_FIELDS) {
        switch(index){
            case GUILD_USER_FIELDS.id: return this.ID;
            case GUILD_USER_FIELDS.guildID: return this.guildID;
            case GUILD_USER_FIELDS.discordID: return this.discordID;
        }
    }
    
    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder> {
        throw new Error("Method not implemented.");
    }
    compareTo(b: GuildUser): number {
        throw new Error("Method not implemented.");
    }

}