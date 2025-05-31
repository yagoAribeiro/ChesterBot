import { BaseApi } from "../api/base-api";
import { DbManager } from "../db/db-manager";

export abstract class BaseRepo{ 
    constructor(protected __sqlManager: DbManager){}

}