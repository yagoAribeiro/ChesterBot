import fs from 'node:fs';
import { CustomCommand } from '../models/custom_command';
import { RESTPostAPIApplicationCommandsJSONBody, REST, Routes, Collection } from 'discord.js';

export class SlashCommandLoader{
    path: string;
    constructor(path: string){
        this.path = path;
    }

    async setup(rest: REST, clientID: string) : Promise<Collection<string, CustomCommand>>{
        const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
        const client_commands: Collection<string, CustomCommand> = new Collection();
        //Read files exporting a 'CustomCommand' object from path. Expected folders terminating with '_commands', and only pick up .js files.
        fs.readdir(this.path, {recursive: true}, (err, files) =>{
            if (err == null){
                for (let file of files){
                    let filePath = this.path.concat('\\', file.toString());
                    if (filePath.indexOf('_commands') != -1 && filePath.endsWith('.js')){
                        let command: any = require(filePath);
                        if (command instanceof CustomCommand){
                            commands.push(command.data.toJSON());
                            client_commands.set(command.data.name, command);
                        }
                    }
                }       
            }
        });
        await rest.put(Routes.applicationCommands(clientID), {body: commands});
        return client_commands;
    }
}
