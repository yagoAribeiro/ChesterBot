import 'reflect-metadata';
import { ENV, SCOPE, Singletons, Entries } from './container';

export class InjectionContainer{
    private Resolved: Map<string, Function> = new Map();

    get<T>(key: string) : T{
        return this.resolve(Entries.get(key) as new <T>(...args: any) => T);
    }

     resolve(target?: new <T>(...args: any) => T): any{
        const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', target) || [];
        const childDeps = paramTypes.map((n: typeof target) => {
            let key: string = Reflect.getMetadata('key', n);
            this.resolve(n);
            if (!this.Resolved.get(key)){
                this.Resolved.set(key, new n());
                return this.Resolved.get(key);  
            }
            return this.Resolved.get(key);
        });
        let key: string = Reflect.getMetadata('key', target);
        if (!this.Resolved.get(key)){
            let result: typeof target;
            switch (Reflect.getMetadata('scope', target)){
                case SCOPE.Transient:
                    result = new target(...childDeps);
                    break;
                case SCOPE.Singleton:
                    if(!Singletons.get(key)) Singletons.set(key, new target(...childDeps));
                    result = Singletons.get(key) as typeof target;
                    break;
                default:
                    throw new EvalError(`Scope of type ${key} could not be found!`);
            };  
           this.Resolved.set(key, result);
           return result;
        }
        else return this.Resolved.get(key);
    }
}

export function injectable(environment: ENV[], scope: SCOPE, key: string): Function {
    return function (target: any){
        Reflect.defineMetadata('injectable', true, target);
        Reflect.defineMetadata('env', environment, target);
        Reflect.defineMetadata('scope', scope, target);
        Reflect.defineMetadata('key', key, target);
    }
}


