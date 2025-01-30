export interface IDataModel<TClass>{
    ID?: number;
    toMap(): Map<string, any>;
    fromMap(map: Map<string, any>): TClass;
}