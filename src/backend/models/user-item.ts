import { IDataModel } from "./i-data-model";

class UserItem implements IDataModel<UserItem>{
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