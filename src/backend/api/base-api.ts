import { DataModel } from "../models/i-data-model";
import { Promise } from 'es6-promise';
import { IBaseApi } from "./base-i-api";

export abstract class BaseApi implements IBaseApi{
    uri: string;
    port: number;
    constructor(uri: string, port: number){
        this.uri = uri;
        this.port = port;
    }
    getTargetUri(): string {
        throw new Error("Method not implemented.");
    }
    get<TModel extends DataModel<TModel>>(uri: string, headers?: Map<string, string>): Promise<TModel> {
        throw new Error("Method not implemented.");
    }
    getAll<TModel extends DataModel<TModel>>(uri: string, headers?: Map<string, string>): Promise<TModel[]> {
        throw new Error("Method not implemented.");
    }
    post(uri: string, body: Map<string, string>, headers?: Map<string, string>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    put(uri: string, id: number, body: Map<string, string>, headers?: Map<string, string>, postId?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(uri: string, id: number, headers?: Map<string, string>, postId?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}