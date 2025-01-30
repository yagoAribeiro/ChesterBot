import { IDataModel } from "./i-data-model";

export class Item implements IDataModel<Item>{
    ID?: number;
    guildID: string;
    name: string;
    description: string;
    weight: number;
    value: number;
    equipable: boolean;
    creationDate: Date;

    constructor(guildID: string, name: string, equipable: boolean, creationDate?: Date, description?: string, weight?: number, value?: number, ID?: number){
        this.guildID = guildID;
        this.name = name;
        this.description = description;
        this.weight = weight;
        this.value = value;
        this.equipable = equipable;
        this.creationDate = creationDate;
        this.ID = ID;
    }

    toMap(): Map<string, any> {
        throw new Error("Method not implemented.");
    }
    fromMap(map: Map<string, any>): Item {
        throw new Error("Method not implemented.");
    }
   
}