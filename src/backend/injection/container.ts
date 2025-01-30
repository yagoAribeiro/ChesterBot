import { Container, injected, tagged } from "brandi";
import { TOKENS, TAGS } from "./tokens";
import { ItemAPI } from "../api/item/item-api";
import { ItemRepo } from "../repo/item/item-repo";
import { ItemTestRepo } from "../repo/item/item-repo-test";

export const CONTAINER = new Container();

CONTAINER.bind(TOKENS.itemAPI)
.toInstance(ItemAPI)
.inTransientScope();

CONTAINER
.bind(TOKENS.itemRepo)
.toInstance(ItemTestRepo)
.inSingletonScope();

injected(ItemRepo, TOKENS.itemAPI.optional);
injected(ItemTestRepo, TOKENS.itemAPI.optional);