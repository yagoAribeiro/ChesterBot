import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";

export class GuildUser implements DataModel<GuildUser>{
    ID?: number;
    
    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder> {
        throw new Error("Method not implemented.");
    }
    compareTo(b: GuildUser): number {
        throw new Error("Method not implemented.");
    }

}