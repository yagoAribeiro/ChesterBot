import { ENV, injectable, SCOPE } from "../../injection/injector";
import { BaseApi } from "../base-api";

@injectable([ENV.Live, ENV.Tests], SCOPE.Transient)
export class ItemAPI extends BaseApi{
    constructor(){
        super("", 10);
    }
    
}
