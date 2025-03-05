import {CommandInteraction } from "discord.js";

/**
 * Custom class that holds data of an exception in the life-cycle of command->database.
 */
export class CommandException extends Error{
    commandInteraction?: CommandInteraction;
    constructor(message?: string, commandInteraction?: CommandInteraction){
        super(message);
        this.name = 'CommandException';
        this.commandInteraction = commandInteraction;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
