import {CommandInteraction } from "discord.js";

export class CommandException extends Error{
    commandInteraction?: CommandInteraction;
    constructor(message?: string, commandInteraction?: CommandInteraction){
        super(message);
        this.name = 'CommandException';
        this.commandInteraction = commandInteraction;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
