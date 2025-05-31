import { ENV, SCOPE } from "../../injection/container";
import { injectable } from "../../injection/injector";
import { GuildModel } from "../../models/guild";
import { GuildUser } from "../../models/guildUser";
import { AppConfig } from "../../utils/app-config";
import { BaseRepo } from "../base-repo";
import { GUILD_REPO_KEY, IGuildRepo } from "./i-guild-repo";


@injectable([ENV.Tests], SCOPE.Singleton, GUILD_REPO_KEY)
export class GuildTestRepo extends BaseRepo implements IGuildRepo {
    private __guilds: GuildModel[] = [];
    private __guildUsers: GuildUser[] = [];
    private guildIncrement: number = 1;
    private guildUserIncrement: number = 1;
    constructor(config: AppConfig) {
        super(null);
        this.__guilds.push(new GuildModel(config.guildDevID, this.guildIncrement++));
    }
    async getGuildByDiscordID(discordGuildID: string): Promise<GuildModel> {
        let guild: GuildModel = this.__guilds.find(g => g.discordID == discordGuildID);
        if (!guild) guild = await this.createGuild(discordGuildID);
        return Promise.resolve(guild);
    }
    getGuildByID(ID: number): Promise<GuildModel | null> {
        return Promise.resolve(this.__guilds.find(g => g.ID == ID));
    }
    createGuild(discordGuildID: string): Promise<GuildModel> {
        let newGuild: GuildModel = new GuildModel(discordGuildID, this.guildIncrement++);
        this.__guilds.push(newGuild);
        console.log(`[CREATE] New Guild: ${newGuild}`);
        return Promise.resolve(newGuild);
    }
    async createGuildUser(guildID: number, discordUserID: string): Promise<GuildUser> {
        let guild: GuildModel = await this.getGuildByID(guildID);
        let newGuildUser: GuildUser = new GuildUser(guildID, discordUserID, guild, this.guildUserIncrement++);
        this.__guildUsers.push(newGuildUser);
        console.log(`[CREATE] New Guild User: ${newGuildUser}`);
        return Promise.resolve(newGuildUser);
    }
    async getGuildUserByDiscordID(discordGuildID: string, discordUserID: string): Promise<GuildUser> {
        let guild: GuildModel = await this.getGuildByDiscordID(discordGuildID);
        let guildUser: GuildUser = this.__guildUsers.find(gu => gu.guildID == guild.ID && gu.discordID == discordUserID);
        if (!guildUser) guildUser = await this.createGuildUser(guild.ID, discordUserID);
        console.log(`[SELECT] Guild User: ${guildUser}`);
        return Promise.resolve(guildUser);
    }
    getGuildUserByID(ID: number): Promise<GuildUser | null> {
        return Promise.resolve(this.__guildUsers.find(gu => gu.ID == ID));
    }

}