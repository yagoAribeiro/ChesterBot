import { OptionBaseData, CommandOptionsContainer} from "./base-command-options"

export enum ITEM_OPTIONS{
    name,
    description,
    weight,
    value,
    quantity,
    secret,
    effect
}

export const itemOptions: CommandOptionsContainer<ITEM_OPTIONS> = new CommandOptionsContainer<ITEM_OPTIONS>(new Map<number, OptionBaseData>([
    [ITEM_OPTIONS.name, new OptionBaseData(ITEM_OPTIONS[ITEM_OPTIONS.name], 'Item\'s name', 256, 2)],
    [ITEM_OPTIONS.description, new OptionBaseData(ITEM_OPTIONS[ITEM_OPTIONS.description], 'Set item\'s description', 1024, 2)],
    [ITEM_OPTIONS.effect, new OptionBaseData(ITEM_OPTIONS[ITEM_OPTIONS.effect], 'Set item\'s effect', 1024, 2)],
    [ITEM_OPTIONS.weight, new OptionBaseData(ITEM_OPTIONS[ITEM_OPTIONS.weight], 'Item\'s weight. Any real number according to your RPG unit measure')],
    [ITEM_OPTIONS.value, new OptionBaseData(ITEM_OPTIONS[ITEM_OPTIONS.value], 'Item\'s value. Any real number according to your RPG currency.')],
    [ITEM_OPTIONS.quantity, new OptionBaseData(ITEM_OPTIONS[ITEM_OPTIONS.quantity], 'Item\'s quantity to change.')],
    [ITEM_OPTIONS.secret, new OptionBaseData(ITEM_OPTIONS[ITEM_OPTIONS.secret], 'Set this item as secret. Secret items won\'t show for those who don\'t have it')],
]));
