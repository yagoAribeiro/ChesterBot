export interface DataModel<TClass>{
    ID?: number;
    toMap(): Map<string, any>;
    fromMap(map: Map<string, any>): TClass;
}