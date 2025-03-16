import { ItemAPI } from "../../api/item/item-api";
import { ENV, SCOPE } from "../../injection/container";
import { injectable} from "../../injection/injector";
import { Item } from "../../models/item";
import { BaseRepo } from "../base-repo";
import { IitemRepo, ITEM_REPO_KEY} from "./i-item-repo";

@injectable([ENV.Live], SCOPE.Transient, ITEM_REPO_KEY)
export class ItemRepo extends BaseRepo<ItemAPI> implements IitemRepo{

   constructor(api: ItemAPI){
      super(api);
   }
   getMaxDepth(guildID: string): Promise<number> {
      throw new Error("Method not implemented.");
   }

   getByDepth(guildID: string, depth?: number,  sorting?: number): Promise<Map<number, Item>> {
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