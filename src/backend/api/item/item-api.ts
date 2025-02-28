import { ENV, SCOPE } from "../../injection/container";
import {injectable } from "../../injection/injector";
import { BaseApi } from "../base-api";

@injectable([ENV.Live, ENV.Tests], SCOPE.Transient, ItemAPI.name)
export class ItemAPI extends BaseApi{
    constructor(){
        super("", 10);
    }
    
}
