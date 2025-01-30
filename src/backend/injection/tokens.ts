import {tag, token} from 'brandi';
import { ItemAPI } from '../api/item/item-api';
import { IitemRepo } from '../repo/item/i-item-repo';

export const TOKENS = {
    itemAPI: token<ItemAPI>('Item API'),
    itemRepo: token<IitemRepo>('Item Repo') 
}

export const TAGS = {
    tests: tag('testes'),
    prod: tag('prod')
}