import { ItemAPI } from "../../api/item/item-api";
import { ENV, SCOPE } from "../../injection/container";
import { injectable } from "../../injection/injector";
import { Item } from "../../models/item";
import { AppConfig } from "../../utils/app-config";
import { CommandException } from "../../utils/command-exception";
import { BaseRepo } from "../base-repo";
import { IitemRepo, ITEM_REPO_KEY } from "./i-item-repo";

@injectable([ENV.Tests], SCOPE.Singleton, ITEM_REPO_KEY)
export class ItemTestRepo extends BaseRepo<ItemAPI> implements IitemRepo {

    private __items: Item[] = [];
    private lastSort?: number = null;

    constructor(api: ItemAPI, config: AppConfig) {
        super(api);
        const guildID: string = config.guildDevID;
        this.__items = [
            new Item(guildID, "Sword of Valor", false, new Date(), "A legendary sword forged in the fires of a dragon's lair. Its blade is etched with ancient runes that glow faintly in the dark.", "A legendary sword with glowing runes, increasing attack power and critical damage chance.", "", 10, 100, 1),
            new Item(guildID, "Shield of Protection", false, new Date(), "A massive shield crafted by the dwarves, made from enchanted steel. It has intricate carvings depicting scenes of ancient battles.", "A massive shield that blocks physical damage and reflects damage back at attackers.", "", 15, 120, 2),
            new Item(guildID, "Healing Potion", false, new Date(), "A small vial containing a glowing, green liquid. It radiates warmth and has a soothing scent, promising relief from pain and injury.", "Restores 50 health over 10 seconds with a chance to heal an extra 25 health.", "", 0.5, 30, 3),
            new Item(guildID, "Magic Staff", false, new Date(), "A long, slender staff carved from an ancient tree in the mystical forest. The top is crowned with a crystal that pulses with magical energy.", "Increases magic power, reduces spell cooldowns, and enhances elemental magic.", "", 8, 200, 4),
            new Item(guildID, "Dragon Scale Armor", false, new Date(), "A suit of armor crafted from the scales of a long-dead dragon. Each scale is as hard as steel and glows with a faint red hue.", "Reduces physical damage and grants fire immunity with increased stamina regeneration.", "", 25, 350, 5),
            new Item(guildID, "Elven Bow", false, new Date(), "A finely crafted bow made from the wood of an ancient elven tree. It is lightweight yet incredibly strong, with intricate carvings along the limbs.", "Increases ranged attack speed and chance to shoot extra arrows, boosting critical hit chance.", "", 5, 150, 6),
            new Item(guildID, "Mystic Ring", false, new Date(), "A ring crafted from silver, adorned with a gemstone that glows faintly. The runes etched into the band seem to shift when viewed from different angles.", "Increases mana regeneration, spellcasting speed, and magic resistance.", "", 0.2, 75, 7),
            new Item(guildID, "Invisibility Cloak", false, new Date(), "A dark cloak woven from enchanted silk. It seems to shimmer and shift, blending seamlessly with the surrounding environment.", "Grants invisibility with increased movement speed and reduces detection chances.", "", 1, 500, 8),
            new Item(guildID, "Fire Bomb", false, new Date(), "A small, spherical object covered in fiery runes. Upon detonation, it unleashes a burst of intense flame.", "Deals fire damage in a radius and causes enemies to burn, taking additional damage.", "", 2, 80, 9),
            new Item(guildID, "Frozen Heart", false, new Date(), "A small, heart-shaped crystal encased in ice. It exudes a chilling aura and has a faint, rhythmic pulse, as though it is alive.", "Slows enemies' movement and attack speed, with a passive aura that reduces nearby enemy speed.", "", 0.3, 60, 10),
            new Item(guildID, "Cloak of Shadows", false, new Date(), "A cloak made from dark, ethereal fabric. It seems to absorb light and appears almost intangible, like a shadow itself.", "Increases stealth abilities and reduces enemy detection range with a chance to avoid damage in stealth.", "", 1, 120, 11),
            new Item(guildID, "Thunder Hammer", false, new Date(), "A massive war hammer with a head that crackles with electrical energy. The handle is reinforced with enchanted steel, and the head is adorned with glowing runes.", "Deals thunder damage, with a chance to stun enemies and chain lightning to nearby targets.", "", 20, 250, 12),
            new Item(guildID, "Potion of Strength", false, new Date(), "A thick, red liquid contained in a glass vial. It has a bitter taste and an invigorating effect that fills the drinker with powerful energy.", "Increases strength and grants additional physical damage during the effect duration.", "", 0.3, 40, 13),
            new Item(guildID, "Golden Crown", false, new Date(), "A crown made of pure gold, encrusted with rare jewels. It radiates an aura of power and influence, capable of commanding the respect of all who behold it.", "Increases charisma, aids persuasion, and boosts faction reputation gains.", "", 0.1, 500, 14),
            new Item(guildID, "Soulstone", false, new Date(), "A glowing gemstone that pulses with an eerie light. It contains the essence of a powerful soul, imprisoned within its crystalline structure.", "Increases dark magic power, grants health-steal on damage, and boosts mana regeneration during combat.", "", 0.2, 150, 15),
            new Item(guildID, "Bow of the Hunter", false, new Date(), "A longbow crafted from the wood of a sacred tree, with feathers from an enchanted phoenix tied to the string. It hums softly when drawn.", "Increases critical hit chance and ranged damage, with a chance to inflict bleeding damage.", "", 6, 100, 16),
            new Item(guildID, "Vampire Fangs", false, new Date(), "A pair of sharp, elongated fangs encased in a leather pouch. These fangs are said to have once belonged to a powerful vampire lord.", "Grants vampiric lifesteal and boosts critical hit chance, with a chance to heal on kill.", "", 0.2, 200, 17),
            new Item(guildID, "Potion of Agility", false, new Date(), "A greenish liquid contained in a slender flask. The potion gives off a faint, refreshing scent that fills the drinker with energy.", "Increases agility, boosts dodging ability, and grants a chance to dodge attacks.", "", 0.2, 45, 18),
            new Item(guildID, "Phoenix Feather", false, new Date(), "A radiant feather that glows with the fiery spirit of a phoenix. It is said to bring rebirth and healing to those who carry it.", "Grants fire resistance and health regeneration, with a chance to revive after death.", "", 0.05, 250, 19),
            new Item(guildID, "Gem of Power", false, new Date(), "A large, multi-faceted gem that pulses with pure energy. The gem is incredibly valuable and radiates immense magical potential.", "Increases all stats, boosts experience gain, and has a chance to double rewards.", "", 0.1, 300, 20),
            new Item(guildID, "Crystal Ball", false, new Date(), "A smooth, transparent sphere with swirling mist inside. It is said to grant visions of the future and provide insight into the unknown.", "Reveals hidden enemies and treasures within range, also shows upcoming major events.", "", 2, 400, 21),
            new Item(guildID, "Boots of Speed", false, new Date(), "Lightweight boots crafted from enchanted leather. They allow the wearer to move at incredible speeds, leaving a blur of motion in their wake.", "Increases movement speed and reduces stamina consumption, with a chance to dash on damage.", "", 1.5, 150, 22),
            new Item(guildID, "Scepter of the Winds", false, new Date(), "A tall, elegant scepter crowned with a swirling gemstone that radiates wind energy. It allows the wielder to control the very air itself.", "Increases air magic power and grants a chance to summon a wind vortex, boosting mana regeneration.", "", 3, 250, 23),
            new Item(guildID, "Leather Armor", false, new Date(), "Simple yet durable armor made from the hide of wild beasts. It provides protection without compromising mobility, making it ideal for adventurers.", "Reduces physical damage and grants a chance to avoid damage, with increased stamina regeneration.", "", 8, 80, 24),
            new Item(guildID, "Ring of Wisdom", false, new Date(), "A ring crafted from silver with an enchanted sapphire that glows with a soft, calming light. It enhances the wearer's intellect and wisdom.", "Increases intelligence, reduces spell cooldowns, and boosts healing spell effectiveness.", "", 0.1, 130, 25),
            new Item(guildID, "Silver Dagger", false, new Date(), "A small, finely crafted dagger made from silver. The blade is razor-sharp, and the hilt is wrapped in leather for a secure grip.", "Increases critical hit chance for melee attacks and grants a chance to poison enemies.", "", 1.2, 60, 26),
            new Item(guildID, "Horn of War", false, new Date(), "A large, ornate horn made from the tusk of a giant beast. It is said to have the power to rally armies and inspire courage in battle.", "Increases nearby allies' attack damage and reduces enemy damage with a chance to inspire fear.", "", 1, 90, 27),
            new Item(guildID, "Book of Spells", false, new Date(), "An ancient tome filled with spells and incantations. The pages are old, but the magic contained within them is timeless.", "Increases spellcasting speed, reduces mana costs, and boosts elemental spell damage.", "", 1.5, 150, 28),
            new Item(guildID, "Iron Sword", false, new Date(), "A basic sword made of iron. While it is not as powerful as legendary weapons, it is a reliable tool for any adventurer.", "Increases attack damage and has a chance to cause bleeding on enemies.", "", 5, 40, 29),
            new Item(guildID, "Potion of Healing", false, new Date(), "A simple healing potion in a glass bottle. It provides immediate relief to those who are wounded in battle.", "Restores health over time with a chance to heal extra health during combat.", "", 0.3, 25, 30),
            new Item(guildID, "Tome of Knowledge", false, new Date(), "A heavy book bound in leather with gold leaf detailing. It contains wisdom from ancient scholars and can greatly enhance one's understanding.", "Increases experience gain, reduces ability cooldowns, and grants a chance to learn new skills from enemies.", "", 0.8, 120, 31),
            new Item(guildID, "Mithril Armor", false, new Date(), "A lightweight yet incredibly strong armor forged from rare mithril. It offers unmatched protection while maintaining mobility.", "Reduces damage and boosts stamina regeneration with increased critical hit resistance.", "", 12, 300, 32),
            new Item(guildID, "Diamond Necklace", false, new Date(), "A beautifully crafted necklace adorned with a diamond that shines brilliantly, even in the darkest of environments.", "Increases health regeneration, resists death once per day, and increases all resistances.", "", 0.05, 450, 33),
            new Item(guildID, "Emerald Ring", false, new Date(), "A luxurious ring made of emeralds, glowing with a soft green light. It is said to offer protection from magical attacks.", "Increases magic resistance, reduces mana cost for defensive spells, and boosts health regeneration.", "", 0.1, 200, 34),
            new Item(guildID, "Potion of Fire Resistance", false, new Date(), "A fiery-red potion contained in a vial of glass. It is said to protect the drinker from the burning touch of flames.", "Grants fire resistance and increases fire resistance for the next hour.", "", 0.3, 70, 35)
        ];
        this.__items.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
    }
    getMaxDepth(guildID: string): Promise<number> {
        return Promise.resolve(Math.ceil(this.__items.filter((item) => item.guildID == guildID).length / 8.0));
    }

    getFromAutocomplete(guildID: string, query: string): Promise<Item[]> {
        if (query.length >= 1) {
            let filtered: Array<Item> = this.__items.filter((item) => item.guildID == guildID && item.name.trim().toLowerCase().includes(query.trim().toLowerCase()));
            return Promise.resolve(filtered.slice(0, Math.min(filtered.length, 20)));
        }
        return Promise.resolve([]);
    }

    async getByDepth(guildID: string, depth: number = 1, sorting?: number): Promise<Map<number, Item>> {
        let max_depth: number = await this.getMaxDepth(guildID);
        depth = depth > max_depth ? max_depth : depth < 1 ? 1 : depth;
        let end: number = depth * 8;
        let start: number = end - 8;
        this.__items = this.lastSort == sorting ? this.__items : this.__items.sort((a, b) => (sorting == 0 ? 1 : -1) * (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
        let filtered: Map<number, Item> = new Map();
        for (let i = 0; i < this.__items.length; i++) {
            if (i >= start && i < end && this.__items[i].guildID == guildID) filtered.set(i, this.__items[i]);
        }
        return Promise.resolve<Map<number, Item>>(filtered);//Sorts
    }
    getItem(itemId: number): Promise<Item | null> {
        return Promise.resolve<Item>(this.__items.find((item) => item.ID == itemId));
    }

    async getItemByName(guildID: string, itemName: string): Promise<Item | null> {
        let item = this.__items.find((item, i) => item.guildID == guildID && item.name.trim().toLowerCase() == itemName.trim().toLowerCase());
        if (!item) throw new Error(`❌ Could not find any item named "${itemName}"`);
        return Promise.resolve(item);
    }

    async addItem(item: Item): Promise<void> {
        item.ID = this.__items.length;
        await new Promise(resolve => setTimeout(resolve, 500));
        this.__items.push(item);
        return Promise.resolve();
    }
    updateItem(itemId: number, model: Item): Promise<void> {
        let index: number = this.__items.findIndex((item) => item.ID == itemId)
        this.__items[index] = model;
        return Promise.resolve();
    }
    delete(itemId: number): Promise<void> {
        let index: number = this.__items.findIndex((item) => item.ID == itemId);
        this.__items.splice(index, 1);
        return Promise.resolve();
    }

}