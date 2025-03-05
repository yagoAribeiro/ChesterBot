import { MessageComponentInteraction, CacheType, CommandInteraction } from "discord.js";
import { CommandException } from "../backend/utils/command-exception";


export class InteractionResolver<T extends MessageComponentInteraction<CacheType> | CommandInteraction<CacheType>> {
    interaction: T;
    constructor(interaction: T) {
        this.interaction = interaction;
    }
    async resolve(task: () => Promise<void>): Promise<T> {
        try {
            if (this.interaction instanceof CommandInteraction) {
                await this.interaction.deferReply();
                await task();
            } else if (this.interaction instanceof MessageComponentInteraction) {
                await (this.interaction as MessageComponentInteraction).deferUpdate();
                await task();
            } else {
                throw new EvalError(`Could not find interaction type of ${this.interaction}`)
            }
            return this.interaction;
        } catch (err) {
            throw new CommandException(err.message, this.interaction as CommandInteraction<CacheType>);
        }
    }

}