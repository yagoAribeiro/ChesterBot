import { injectable } from '../injection/injector';
import { ENV, SCOPE } from '../injection/container';
import { resolve, join } from 'node:path';
import fs from 'node:fs';


@injectable([ENV.Tests, ENV.Live], SCOPE.Singleton, AppConfig.name)
export class AppConfig {
    clientID: string;
    guildDevID: string;
    token: string;
    constructor() {
        const json = JSON.parse(fs.readFileSync(join(resolve(), '/config.json'), { encoding: 'utf8' }).toString());
        this.clientID = json.clientID;
        this.guildDevID = json.developmentGuild;
        this.token = json.token;
    }
}
