import { BaseApi } from "../api/base-api";

export abstract class BaseRepo<TClass extends BaseApi>{
    constructor(protected __base_api: TClass){}
}