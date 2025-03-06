import { ItemAPI } from "../../api/item/item-api";
import { ENV, SCOPE } from "../../injection/container";
import {injectable} from "../../injection/injector";
import { Item } from "../../models/item";
import { AppConfig } from "../../utils/app-config";
import { CommandException } from "../../utils/command-exception";
import { BaseRepo } from "../base-repo";
import { IitemRepo, ITEM_REPO_KEY } from "./i-item-repo";

@injectable([ENV.Tests], SCOPE.Singleton, ITEM_REPO_KEY)
export class ItemTestRepo extends BaseRepo<ItemAPI> implements IitemRepo {

    private __items: Item[] = [];

    constructor(api: ItemAPI, config: AppConfig) {
        super(api);
        const guildID: string = config.guildDevID;
        this.__items = [
            new Item(guildID, "Sword of Valor", false, new Date(), "A legendary sword forged in the fires of a dragon's lair. Its blade is etched with ancient runes that glow faintly in the dark.", "Increases attack power by 25% and grants a chance to deal double damage on a critical hit.", 10, 100, 1),
            new Item(guildID, "Shield of Protection", false, new Date(), "A massive shield crafted by the dwarves, made from enchanted steel. It has intricate carvings depicting scenes of ancient battles.", "Blocks 15% of incoming physical damage and provides a 10% chance to reflect damage back at the attacker.", 15, 120, 2),
            new Item(guildID, "Healing Potion", false, new Date(), "A small vial containing a glowing, green liquid. It radiates warmth and has a soothing scent, promising relief from pain and injury.", "Restores 50 health points over 10 seconds and provides a 10% chance to heal an additional 25 health points.", 0.5, 30, 3),
            new Item(guildID, "Magic Staff", false, new Date(), "A long, slender staff carved from an ancient tree in the mystical forest. The top is crowned with a crystal that pulses with magical energy.", "Increases magic power by 30%, reduces spell cooldowns by 10%, and enhances the effectiveness of all elemental magic.", 8, 200, 4),
            new Item(guildID, "Dragon Scale Armor", false, new Date(), "A suit of armor crafted from the scales of a long-dead dragon. Each scale is as hard as steel and glows with a faint red hue.", "Reduces all physical damage by 20%, grants immunity to fire damage for 10 seconds, and increases stamina regeneration by 5%.", 25, 350, 5),
            new Item(guildID, "Elven Bow", false, new Date(), "A finely crafted bow made from the wood of an ancient elven tree. It is lightweight yet incredibly strong, with intricate carvings along the limbs.", "Increases ranged attack speed by 15%, grants a 10% chance to shoot an extra arrow on each attack, and boosts critical hit chance by 5%.", 5, 150, 6),
            new Item(guildID, "Mystic Ring", false, new Date(), "A ring crafted from silver, adorned with a gemstone that glows faintly. The runes etched into the band seem to shift when viewed from different angles.", "Increases mana regeneration by 5% every 5 seconds, boosts spellcasting speed by 10%, and grants a passive 3% magic resistance.", 0.2, 75, 7),
            new Item(guildID, "Invisibility Cloak", false, new Date(), "A dark cloak woven from enchanted silk. It seems to shimmer and shift, blending seamlessly with the surrounding environment.", "Grants invisibility for 10 seconds, reducing detection chances by 50%. While invisible, movement speed is increased by 20%, and any attack will break the invisibility.", 1, 500, 8),
            new Item(guildID, "Fire Bomb", false, new Date(), "A small, spherical object covered in fiery runes. Upon detonation, it unleashes a burst of intense flame.", "Deals 100 fire damage in a 5-meter radius and causes enemies to burn for 5 seconds, taking an additional 20 damage per second. Can be used to ignite enemies or environmental hazards.", 2, 80, 9),
            new Item(guildID, "Frozen Heart", false, new Date(), "A small, heart-shaped crystal encased in ice. It exudes a chilling aura and has a faint, rhythmic pulse, as though it is alive.", "Slows enemy movement speed by 30% for 10 seconds on use and reduces enemy attack speed by 10%. Provides a passive aura that reduces the movement speed of nearby enemies by 10%.", 0.3, 60, 10),
            new Item(guildID, "Cloak of Shadows", false, new Date(), "A cloak made from dark, ethereal fabric. It seems to absorb light and appears almost intangible, like a shadow itself.", "Increases stealth abilities by 40%, reduces the range at which enemies can detect you by 25%, and grants a 20% chance to avoid all damage while in stealth.", 1, 120, 11),
            new Item(guildID, "Thunder Hammer", false, new Date(), "A massive war hammer with a head that crackles with electrical energy. The handle is reinforced with enchanted steel, and the head is adorned with glowing runes.", "Deals 50 thunder damage on impact, with a 15% chance to stun enemies for 2 seconds. All attacks have a 10% chance to deal additional chain lightning damage to up to 3 nearby enemies.", 20, 250, 12),
            new Item(guildID, "Potion of Strength", false, new Date(), "A thick, red liquid contained in a glass vial. It has a bitter taste and an invigorating effect that fills the drinker with powerful energy.", "Increases strength by 30% for 5 minutes, granting an additional 10% physical damage on all attacks during the effect duration.", 0.3, 40, 13),
            new Item(guildID, "Golden Crown", false, new Date(), "A crown made of pure gold, encrusted with rare jewels. It radiates an aura of power and influence, capable of commanding the respect of all who behold it.", "Increases charisma by 25%, provides a 10% chance to persuade NPCs in dialogues, and boosts all faction reputation gains by 15%.", 0.1, 500, 14),
            new Item(guildID, "Soulstone", false, new Date(), "A glowing gemstone that pulses with an eerie light. It contains the essence of a powerful soul, imprisoned within its crystalline structure.", "Increases dark magic power by 20%, grants a 15% chance to steal 5% of damage dealt as health, and provides a 5% bonus to mana regeneration when in combat.", 0.2, 150, 15),
            new Item(guildID, "Bow of the Hunter", false, new Date(), "A longbow crafted from the wood of a sacred tree, with feathers from an enchanted phoenix tied to the string. It hums softly when drawn.", "Increases critical hit chance for ranged attacks by 20%, boosts ranged attack damage by 10%, and provides a 5% chance to cause a bleed effect that deals 10 damage per second for 5 seconds.", 6, 100, 16),
            new Item(guildID, "Vampire Fangs", false, new Date(), "A pair of sharp, elongated fangs encased in a leather pouch. These fangs are said to have once belonged to a powerful vampire lord.", "Grants 15% vampiric lifesteal on melee attacks, increases critical hit chance by 5%, and provides a 10% chance to heal for 30 health when killing an enemy.", 0.2, 200, 17),
            new Item(guildID, "Potion of Agility", false, new Date(), "A greenish liquid contained in a slender flask. The potion gives off a faint, refreshing scent that fills the drinker with energy.", "Increases agility by 25% for 5 minutes, improves dodging ability by 15%, and grants a 10% chance to dodge incoming attacks during the effect duration.", 0.2, 45, 18),
            new Item(guildID, "Phoenix Feather", false, new Date(), "A radiant feather that glows with the fiery spirit of a phoenix. It is said to bring rebirth and healing to those who carry it.", "Grants fire resistance by 50% for 10 minutes, increases health regeneration by 5%, and provides a 20% chance to automatically revive the user with 50% health upon death once per day.", 0.05, 250, 19),
            new Item(guildID, "Gem of Power", false, new Date(), "A large, multi-faceted gem that pulses with pure energy. The gem is incredibly valuable and radiates immense magical potential.", "Increases all stats by 10%, boosts experience gain by 10%, and grants a 5% chance to double any rewards from quests and combat.", 0.1, 300, 20),
            new Item(guildID, "Crystal Ball", false, new Date(), "A smooth, transparent sphere with swirling mist inside. It is said to grant visions of the future and provide insight into the unknown.", "Reveals the locations of hidden enemies and treasures within a 20-meter radius for 1 minute. It can also be used to reveal the next major event in the game world.", 2, 400, 21),
            new Item(guildID, "Boots of Speed", false, new Date(), "Lightweight boots crafted from enchanted leather. They allow the wearer to move at incredible speeds, leaving a blur of motion in their wake.", "Increases movement speed by 20%, reduces stamina consumption while running by 15%, and grants a 10% chance to dash forward 10 meters when taking damage.", 1.5, 150, 22),
            new Item(guildID, "Scepter of the Winds", false, new Date(), "A tall, elegant scepter crowned with a swirling gemstone that radiates wind energy. It allows the wielder to control the very air itself.", "Increases air magic power by 25%, grants a 10% chance to summon a wind vortex that pulls enemies toward you, and increases mana regeneration by 10%.", 3, 250, 23),
            new Item(guildID, "Leather Armor", false, new Date(), "Simple yet durable armor made from the hide of wild beasts. It provides protection without compromising mobility, making it ideal for adventurers.", "Reduces physical damage by 10%, increases stamina regeneration by 5%, and grants a 5% chance to avoid damage from attacks.", 8, 80, 24),
            new Item(guildID, "Ring of Wisdom", false, new Date(), "A ring crafted from silver with an enchanted sapphire that glows with a soft, calming light. It enhances the wearer's intellect and wisdom.", "Increases intelligence by 20%, reduces spell cooldowns by 5%, and boosts the effectiveness of healing spells by 10%.", 0.1, 130, 25),
            new Item(guildID, "Silver Dagger", false, new Date(), "A small, finely crafted dagger made from silver. The blade is razor-sharp, and the hilt is wrapped in leather for a secure grip.", "Increases critical hit chance by 15% for melee attacks, grants a 5% chance to poison enemies for 10 seconds, dealing 5 damage per second.", 1.2, 60, 26),
            new Item(guildID, "Horn of War", false, new Date(), "A large, ornate horn made from the tusk of a giant beast. It is said to have the power to rally armies and inspire courage in battle.", "Increases attack damage of all nearby allies by 20% for 10 seconds, provides a 10% chance to inspire fear in enemies, reducing their attack damage by 15% for 5 seconds.", 1, 90, 27),
            new Item(guildID, "Book of Spells", false, new Date(), "An ancient tome filled with spells and incantations. The pages are old, but the magic contained within them is timeless.", "Increases spellcasting speed by 20%, reduces mana costs for all spells by 10%, and adds 5% more damage to all elemental spells.", 1.5, 150, 28),
            new Item(guildID, "Iron Sword", false, new Date(), "A basic sword made of iron. While it is not as powerful as legendary weapons, it is a reliable tool for any adventurer.", "Increases attack damage by 10%, has a 5% chance to cause bleeding, dealing 5 damage per second for 3 seconds.", 5, 40, 29),
            new Item(guildID, "Potion of Healing", false, new Date(), "A simple healing potion in a glass bottle. It provides immediate relief to those who are wounded in battle.", "Restores 30 health points over 5 seconds and has a 10% chance to heal an additional 10 health when used during combat.", 0.3, 25, 30),
            new Item(guildID, "Tome of Knowledge", false, new Date(), "A heavy book bound in leather with gold leaf detailing. It contains wisdom from ancient scholars and can greatly enhance one's understanding.", "Increases experience gain by 20%, reduces cooldowns for abilities by 5%, and grants a 5% chance to learn new skills from defeating powerful enemies.", 0.8, 120, 31),
            new Item(guildID, "Mithril Armor", false, new Date(), "A lightweight yet incredibly strong armor forged from rare mithril. It offers unmatched protection while maintaining mobility.", "Reduces all damage by 15%, increases critical hit resistance by 10%, and boosts stamina regeneration by 10%.", 12, 300, 32),
            new Item(guildID, "Diamond Necklace", false, new Date(), "A beautifully crafted necklace adorned with a diamond that shines brilliantly, even in the darkest of environments.", "Increases health regeneration by 5%, grants a 10% chance to resist death once per day, and increases all resistances by 5%.", 0.05, 450, 33),
            new Item(guildID, "Emerald Ring", false, new Date(), "A luxurious ring made of emeralds, glowing with a soft green light. It is said to offer protection from magical attacks.", "Increases magic resistance by 15%, reduces mana cost for defensive spells by 10%, and grants a passive 5% bonus to health regeneration.", 0.1, 200, 34),
            new Item(guildID, "Potion of Fire Resistance", false, new Date(), "A fiery-red potion contained in a vial of glass. It is said to protect the drinker from the burning touch of flames.", "Grants 30 minutes of fire resistance, reduces fire damage taken by 50%, and increases fire resistance by 10% for the next hour.", 0.3, 70, 35)
          ];
        this.__items.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
    }

    getFromAutocomplete(guildID: string, query: string): Promise<Item[]> {
        if (query.length >= 1) {
            let filtered: Array<Item> = this.__items.filter((item) => item.guildID == guildID && item.name.trim().toLowerCase().includes(query.trim().toLowerCase()));
            return Promise.resolve(filtered.slice(0, Math.min(filtered.length, 20)));
        }
        return Promise.resolve([]);
    }

    getByDepth(guildID: string, depth: number = 1): Promise<Item[]> {
        let max_depth: number = Math.floor(this.__items.length/8.0);
        depth = depth > max_depth ? max_depth : depth < 1 ? 1 : depth;
        let end: number = depth * 8;
        let start: number = end - 8;
        let filtered: Array<Item> = this.__items.filter((item) => item.guildID == guildID);
        return Promise.resolve<Item[]>(filtered.slice(start, end));
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