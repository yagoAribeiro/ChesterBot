import 'reflect-metadata';
import { ENV, SCOPE, Singletons, Entries } from './container';

/**
 * Self made class that implements dependency injection across application. Applying the principles of inversion of control and making tests more manageable.
 * 
 * A new instance should be created for every unit of work.
 */
export class InjectionContainer {
    private Resolved: Map<string, Function> = new Map();

    /**
     * Resolve an instance of T accordingly to the key registered.
     * @param key - The unique identifier T was previously set.
     * @returns An instance of T.
     */
    get<T>(key: string): T {
        return this.resolve(Entries.get(key) as new <T>(...args: any) => T);
    }

    /**
     * Recursively resolves a constructor definition and its dependencies and returns an instance.
     * @param target - A constructor definition.
     * @returns A resolved definition of target.
     */
    resolve(target?: new <T>(...args: any) => T): any {
        const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', target) || []; //Get metadata of all dependencies types.
        const childDeps = paramTypes.map((n: typeof target) => this.resolve(n)); //Calls itself until it resolves the dependencies of the dependencies.
        let key: string = Reflect.getMetadata('key', target);
        if (!this.Resolved.get(key)) { //Try find a previously resolved constructor, or else, resolve it.
            let result: typeof target;
            switch (Reflect.getMetadata('scope', target)) {
                case SCOPE.Transient:
                    result = new target(...childDeps);
                    break;
                case SCOPE.Singleton:
                    if (!Singletons.get(key)) Singletons.set(key, new target(...childDeps)); //If singleton doesn't exists, instantiate a new one.
                    result = Singletons.get(key) as typeof target;
                    break;
                default:
                    throw new EvalError(`Scope of type ${key} could not be found!`); //Scope is mandatory.
            };
            this.Resolved.set(key, result);
            return result;
        }
        else return this.Resolved.get(key);
    }
}

/**
 * Mark this constructor definition as injectable. Once properly set in injection container, it will inject this constructor once called, and also, it will declare any injectable dependency in the constructor. 
 * @param environment - The environments this class will be used.
 * @param scope - The scope this class will have for every time it's injected.
 * @param key - The unique string identifier for this class. It's a good practice for it to be the exact name of the interface/super class this class implements.
 * @returns The modified constructor definition to override the original.
 */
export function injectable(environment: ENV[], scope: SCOPE, key: string): Function {
    return function (target: any) {
        Reflect.defineMetadata('injectable', true, target);
        Reflect.defineMetadata('env', environment, target);
        Reflect.defineMetadata('scope', scope, target);
        Reflect.defineMetadata('key', key, target);
    }
}


