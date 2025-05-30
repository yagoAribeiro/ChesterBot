import { OptionBaseData, CommandOptionsContainer} from "./base-command-options"

export enum INVENTORY_OPTIONS{
    currency,
    max_weight,
    user,
}

export const inventoryOptions: CommandOptionsContainer<INVENTORY_OPTIONS> = new CommandOptionsContainer<INVENTORY_OPTIONS>(new Map<number, OptionBaseData>([
    [INVENTORY_OPTIONS.currency, new OptionBaseData(INVENTORY_OPTIONS[INVENTORY_OPTIONS.currency], 'Inventory\'s currency.')],
    [INVENTORY_OPTIONS.max_weight, new OptionBaseData(INVENTORY_OPTIONS[INVENTORY_OPTIONS.max_weight], 'Inventory\'s maximum weight.')],
    [INVENTORY_OPTIONS.user, new OptionBaseData(INVENTORY_OPTIONS[INVENTORY_OPTIONS.user], 'The inventory\'s owner.')]
]));
