import 'reflect-metadata';
import { ItemAPI } from "../api/item/item-api";
import { ItemRepo } from "../repo/item/item-repo";
import { ItemTestRepo } from "../repo/item/item-repo-test";
import { ITEM_REPO_KEY } from '../repo/item/i-item-repo';
import { AppConfig } from '../utils/app-config';

export const Entries: Map<string, Function | Array<Function>> = new Map<string, Function | Array<Function>>([
    [ITEM_REPO_KEY, [ItemTestRepo, ItemRepo]],
    [ItemAPI.name, ItemAPI],
    [AppConfig.name, AppConfig]
]);
