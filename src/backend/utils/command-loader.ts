import fs from 'node:fs';
import { CustomCommand } from '../models/custom-command';
import { RESTPostAPIApplicationCommandsJSONBody, REST, Routes, Collection } from 'discord.js';
import { AppConfig } from './app-config';
import { InjectionContainer } from '../injection/injector';

/**
 * Class that dynamically loads and assigns all files inside "*-commands" directories to discord client.
 */
export class SlashCommandLoader{
    path: string;
    constructor(path: string){
        this.path = path;
    }

    async setup(rest: REST, clientID: string) : Promise<Collection<string, CustomCommand>>{
        const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
        const devCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
        const clientCommands: Collection<string, CustomCommand> = new Collection();
        //Read files exporting a 'CustomCommand' object from path. Expected folders terminating with '-commands', and only pick up .js files.
        fs.readdir(this.path, {recursive: true}, (err, files) =>{
            if (err == null){
                for (let file of files){
                    let filePath = this.path.concat('\\', file.toString());
                    if (filePath.indexOf('-commands') != -1 && filePath.endsWith('.js')){
                        let command: any = require(filePath);
                        if (command instanceof CustomCommand){
                            if (command.devOnly) devCommands.push(command.data.toJSON());
                            else commands.push(command.data.toJSON());
                            clientCommands.set(command.data.name, command);
                            console.log(`${filePath} - Command '${command.data.name}' was set succesfully. `)
                        }
                    }
                }       
            }
        });
        const config: AppConfig = new InjectionContainer().get<AppConfig>(AppConfig.name);
        await rest.put(Routes.applicationGuildCommands(clientID, config.guildDevID), {body: devCommands});
        await rest.put(Routes.applicationCommands(clientID));
        return clientCommands;
    }
}
