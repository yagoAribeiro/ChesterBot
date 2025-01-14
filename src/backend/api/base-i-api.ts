import { IDataModel } from "../models/i-data-model";
import {Promise} from 'es6-promise';

export interface IApi{
    uri: string;
    get<TModel extends IDataModel>(uri: string, headers?: Map<string, string>): Promise<TModel>;
    getAll<TModel extends IDataModel>(uri: string, headers?: Map<string, string>): Promise<TModel[]>;
    post(uri: string, body: Map<string, string>, headers?: Map<string, string>): Promise<void>;
    put(uri: string, id: number, body: Map<string, string>, headers?: Map<string, string>,  postId?: string): Promise<void>;
}