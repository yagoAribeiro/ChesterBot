import { GuildModel } from "../../models/guild";
import { GuildUser } from "../../models/guildUser";

export interface IGuildRepo {
    getGuildByDiscordID(discordGuildID: string): Promise<GuildModel>;
    getGuildByID(ID: number): Promise<GuildModel | null>;
    createGuild(discordGuildID: string): Promise<GuildModel>;
    createGuildUser(guildID: number, discordUserID: string): Promise<GuildUser>;
    getGuildUserByDiscordID(discordGuildID: string, discordUserID: string): Promise<GuildUser>;
    getGuildUserByID(ID: number): Promise<GuildUser | null>
}

export const GUILD_REPO_KEY = "IGuildRepo";