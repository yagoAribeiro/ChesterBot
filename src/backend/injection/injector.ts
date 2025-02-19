import 'reflect-metadata';

export const enum ENV {
    Tests = 0,
    Live = 1
}

export const enum SCOPE{
    Transient = 0,
    Singleton = 1
}

const CURRENT: ENV = ENV.Tests;

export class InjectionContainer{
    private static Container: Map<string, Function | Array<Function>> = new Map();
    private static Resolved: Map<string, Function> = new Map();
    private static Singletons: Map<string, object> = new Map();

    static set(key: string, value: Function): void{
        this.Container.set(key, value);
    }

    static init(deps: Map<string, Function | Array<Function>>): void{
        this.Container = deps;
        this.Container.forEach((target: new <T>(...args: any) => T | Array<new <T>(...args: any) => T>, key) => {
            let predicate: (value: any) => boolean = (n) => Reflect.getMetadata('injectable', n) && (Reflect.getMetadata('env', n) as ENV[] || []).indexOf(CURRENT) != -1;
            let error: string = `Injector failed to resolve ${target}. Check for duplicate ENVs or lack of it.`;
            if (target instanceof Array) {
                let match: Array<new <T>(...args: any) => T> = target.filter(predicate);
                if (match.length != 1) throw new EvalError(error);
                else target = match[0];
            }else{
                if (!predicate(target)) throw new EvalError(error);
            }
            Reflect.defineMetadata('key', key, target);
            this.resolve(target as new <T>(...args: any) => T);
        });
    }

    static get<T>(key: string) : T{
        if (!this.Resolved.get(key)) throw new EvalError(`Could not resolve dependencies for '${key}'`)
        return this.resolve(this.Resolved.get(key) as new <T>(...args: any) => T);
    }

    static resolve(target?: new <T>(...args: any) => T): any{
        const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', target) || [];
        const childDeps = paramTypes.map((n: typeof target) => {
            let test = this.resolve(n);
            return test;
        });
        if (!Reflect.getMetadata('injectable', target) || !Reflect.getMetadata('key', target)) return target;
        let key: string = Reflect.getMetadata('key', target);
        if (!this.Resolved.get(key)){
            let result: typeof target;
            switch (Reflect.getMetadata('scope', target)){
                case SCOPE.Transient:
                    result = new target(childDeps);
                    break;
                case SCOPE.Singleton:
                    if(!this.Singletons.get(key)) this.Singletons.set(key, new target(childDeps));
                    result = this.Singletons.get(key) as typeof target;
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

export function injectable(environment: ENV[], scope: SCOPE): Function {
    return function (target: any){
        Reflect.defineMetadata('injectable', true, target);
        Reflect.defineMetadata('env', environment, target);
        Reflect.defineMetadata('scope', scope, target);
    }
}


