import { StringSelectMenuOptionBuilder } from "discord.js";
import { RowDataPacket } from "mysql2";
import { DataModel } from "./i-data-model";

export class Guild implements DataModel<Guild>{
    ID?: number;
    discordID: string;

    constructor(discordID: string, ID?: number){
        this.discordID = discordID
        this.ID = ID;
    }

    static fromDbRow(row: RowDataPacket): Guild {
        return new Guild(row[0]["DiscordID"] as string, row[0]["ID"] as number);
    }
    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder> {
        throw new Error("Method not implemented.");
    }
    compareTo(b: Guild): number {
        throw new Error("Method not implemented.");
    }
    
}