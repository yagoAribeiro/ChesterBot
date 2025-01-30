import { IDataModel } from "../models/i-data-model";
import { Promise } from 'es6-promise';

export interface IBaseApi{
    uri: string;
    port: number;
    getTargetUri() : string;
    get<TModel extends IDataModel<TModel>>(uri: string, headers?: Map<string, string>): Promise<TModel>;
    getAll<TModel extends IDataModel<TModel>>(uri: string, headers?: Map<string, string>): Promise<TModel[]>;
    post(uri: string, body: Map<string, string>, headers?: Map<string, string>): Promise<void>;
    put(uri: string, id: number, body: Map<string, string>, headers?: Map<string, string>, postId?: string): Promise<void>;
    delete(uri: string, id: number, headers?: Map<string, string>, postId?: string): Promise<void>;

}