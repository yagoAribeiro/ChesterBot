import { ENV, SCOPE } from "../injection/container";
import { injectable } from "../injection/injector";
import { AppConfig } from "../utils/app-config";
import {Pool, RowDataPacket, createPool} from "mysql2/promise";


@injectable([ENV.Tests, ENV.Live], SCOPE.Singleton, DbManager.name)
export class DbManager{
    config: AppConfig;
    pool: Pool;
    constructor(config: AppConfig){
        this.config = config;
    }

    async getConnectionPool(): Promise<Pool>{
        if (!this.pool) this.pool = createPool({
           host: this.config.dbHost,
           port: this.config.dbPort,
           user: this.config.dbUser,
           database: this.config.database,
           password: this.config.dbPassword,
           waitForConnections: true,
           connectionLimit: 10,
           maxIdle: 10,
        });
        return this.pool;
    }

}