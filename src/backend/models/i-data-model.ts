import { StringSelectMenuOptionBuilder } from "discord.js";

export interface DataModel<TClass = any>{
    ID?: number;
    toMap(): Map<string, any>;
    fromMap(map: Map<string, any>): TClass;
    toSelectOption(index?: number): StringSelectMenuOptionBuilder;
}