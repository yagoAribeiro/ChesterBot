import { BaseApi } from "../api/base-api";

export abstract class BaseRepo<TApi extends BaseApi>{ 
    constructor(protected __baseApi: TApi){}

}