import { StringSelectMenuOptionBuilder } from "discord.js";
import { RowDataPacket } from "mysql2/promise";

export interface DataModel<TClass = any, TEnum extends number = any>{
    ID?: number;
    getByEnum(index: TEnum) : any;
    toSelectOption(index?: number): Promise<StringSelectMenuOptionBuilder>;
    compareTo(b: TClass): number;
}