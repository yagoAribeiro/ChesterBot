import { StringSelectMenuOptionBuilder } from "discord.js";
import { RowDataPacket } from "mysql2/promise";

export interface DataModel<TClass = any>{
    ID?: number;
    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder>;
    compareTo(b: TClass): number;
}