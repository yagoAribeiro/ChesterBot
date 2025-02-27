import { resolve, join } from 'node:path';
import fs from 'node:fs';
import { injectable, SCOPE } from '../injection/injector';

@injectable([], SCOPE.Singleton)
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
