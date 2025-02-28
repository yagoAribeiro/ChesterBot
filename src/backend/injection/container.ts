import 'reflect-metadata';

export const enum ENV {
    Tests = 0,
    Live = 1
}

export const enum SCOPE {
    Transient = 0,
    Singleton = 1
}
export const CURRENT: ENV = ENV.Tests;

export const Singletons: Map<string, Function> = new Map<string, Function>();
export const Entries: Map<string, Function> = new Map<string, Function>();
export function setEntries(deps: Array<Function>){
    deps.forEach((fn) => {
        let filtered: Array<Function> = deps.filter(((fn2) => {
            let injectable: boolean = Reflect.getMetadata('injectable', fn2);
            let hasKey: boolean = Reflect.getMetadata('key', fn2) == Reflect.getMetadata('key', fn);
            let hasEnv: boolean = (Reflect.getMetadata('env', fn2) as ENV[]).indexOf(CURRENT) != -1;
            return injectable && hasKey && hasEnv;
        }));
        if (filtered.length == 1) {
            Entries.set(Reflect.getMetadata('key', fn), fn);
        } else if (filtered.length > 1) throw EvalError(`Invalid injectable signature for '${fn.name}' `);
    });
}



