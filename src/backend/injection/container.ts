import 'reflect-metadata';

/**
 * @Tests Local and hardcoded data for tests, allocated in memory.
 * @Live Local or remote live-data, allocated in a database scheme.
 */
export const enum ENV {
    Tests = 0,
    Live = 1
}

/**
 * @Transient New instance for every injector call.
 * @Singleton The same instance for every injector call.
 */
export const enum SCOPE {
    Transient = 0,
    Singleton = 1
}
/**
 * The current environment to use when running.
 * @todo Transfer this to 'config.json'.
 */
export const CURRENT: ENV = ENV.Live;

/**
 * All the singletons of application, declared at runtime.
 */
export const Singletons: Map<string, Function> = new Map<string, Function>();
/**
 * All the class definitions to be injected across the applications routines, declared at runtime.
 */
export const Entries: Map<string, Function> = new Map<string, Function>();

/**
 * Function responsible to register dependencies before application is ready.
 * @important Expected to be called once per application, before any calls to injector class.
 * @param deps - The dependencies to declare to entries collection.
 */
export function setEntries(deps: Array<Function>){
    deps.forEach((fn) => { //Apply filter to dependencies. Only allows class definitions who implements @injectable properly. 
        let filtered: Array<Function> = deps.filter(((fn2) => {
            let injectable: boolean = Reflect.getMetadata('injectable', fn2);
            let hasKey: boolean = Reflect.getMetadata('key', fn2) == Reflect.getMetadata('key', fn);
            let hasEnv: boolean = (Reflect.getMetadata('env', fn2) as ENV[]).indexOf(CURRENT) != -1;
            return injectable && hasKey && hasEnv;
        })); 
        if (filtered.length == 1) { //Expected only one class definition for each unique key. This definition must be accordingly to the constant ENV.
            Entries.set(Reflect.getMetadata('key', fn), fn);
        } else if (filtered.length > 1) throw EvalError(`Invalid injectable signature for '${fn.name}' `);
    });
}



