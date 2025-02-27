import { ApplicationCommandOptionBase, SlashCommandStringOption } from "discord.js";

export class OptionBaseData{
    private name: string;
    private description: string;
    private maxLength?: number;
    private minLength?: number;
    
    constructor(name: string, description: string, maxLength?: number, minLength?: number){
        this.name = name;
        this.description = description;
        this.maxLength = maxLength;
        this.minLength = minLength;
    }

    applyData(instance: ApplicationCommandOptionBase): ApplicationCommandOptionBase{
        instance.setName(this.name).setDescription(this.description);
        switch (typeof instance){
            case typeof SlashCommandStringOption:
                (instance as SlashCommandStringOption).setMaxLength(this.maxLength).setMinLength(this.minLength);
        }
        return instance;
    }

    getName(): string{
        return this.name;
    }
}

export class CommandOptionsContainer<Enum extends number>{
    private optionsData: Map<Enum, OptionBaseData>; 
    constructor(data: Map<Enum, OptionBaseData>){
        this.optionsData = data;
    }
    getCommandOption<T extends ApplicationCommandOptionBase>(type: Enum, builder: ()=>T): T{
        return this.optionsData.get(type).applyData(builder.call(null)) as T;
    } 

    getName(type: Enum): string{
        return this.optionsData.get(type).getName();
    }
}