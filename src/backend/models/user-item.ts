import { StringSelectMenuOptionBuilder } from "discord.js";
import { DataModel } from "./i-data-model";

class UserItem implements DataModel<UserItem>{
    toSelectOption(): StringSelectMenuOptionBuilder {
        throw new Error("Method not implemented.");
    }
    ID?: number;
    userID: number;
    itemID: number;
    quantity: number;
    acquisitionDate: Date;
    equipped: boolean;

    toMap(): Map<string, string> {
        throw new Error("Method not implemented.");
    }
    fromMap(map: Map<string, string>): UserItem {
        throw new Error("Method not implemented.");
    }
}