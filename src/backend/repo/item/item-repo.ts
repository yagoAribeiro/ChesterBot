import { ItemAPI } from "../../api/item/item-api";
import { Item } from "../../models/item";
import { BaseRepo } from "../base-repo";
import { IitemRepo } from "./i-item-repo";

export class ItemRepo extends BaseRepo<ItemAPI> implements IitemRepo{

   getAll(guildID: string, depth?: number): Promise<Item[]> {
      throw new Error("Method not implemented.");
   }
   getFromAutocomplete(guildID: string, query: string, depth?: number): Promise<Item[]> {
      throw new Error("Method not implemented.");
   }
   getItem(itemID: number): Promise<Item | null> {
      throw new Error("Method not implemented.");
   }
   getItemByName(guildID: string, itemName: string): Promise<Item | null> {
      throw new Error("Method not implemented.");
   }
   addItem(item: Item): Promise<void> {
      throw new Error("Method not implemented.");
   }
   updateItem(itemID: number, model: Item): Promise<void> {
      throw new Error("Method not implemented.");
   }
   delete(itemID: number): Promise<void> {
      throw new Error("Method not implemented.");
   }
  
 
}