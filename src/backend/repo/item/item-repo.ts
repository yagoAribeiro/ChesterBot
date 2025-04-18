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
   deleteItem(itemID: number): Promise<void> {
      throw new Error("Method not implemented.");
   }
   getItemsByDepth(guildID: string, depth: number): Promise<Map<number, Item>> {
      throw new Error("Method not implemented.");
   }
   getItemsFromAutocomplete(guildID: string, query: string): Promise<Item[]> {
      throw new Error("Method not implemented.");
   }
   getMaxDepth(guildID: string): Promise<number> {
      throw new Error("Method not implemented.");
   }
  
  
 
}