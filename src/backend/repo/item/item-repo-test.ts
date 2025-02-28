import { ItemAPI } from "../../api/item/item-api";
import { ENV, SCOPE } from "../../injection/container";
import {injectable} from "../../injection/injector";
import { Item } from "../../models/item";
import { AppConfig } from "../../utils/app-config";
import { BaseRepo } from "../base-repo";
import { IitemRepo, ITEM_REPO_KEY } from "./i-item-repo";

@injectable([ENV.Tests], SCOPE.Singleton, ITEM_REPO_KEY)
export class ItemTestRepo extends BaseRepo<ItemAPI> implements IitemRepo {

    private __items: Item[] = [];

    constructor(api: ItemAPI, config: AppConfig) {
        super(api);
        const guildID: string = config.guildDevID;
        this.__items = [new Item(guildID, 'Espada Longa', true, new Date(), 'Uma espada de lâmina longa e afiada.', 3.5, 100, 1),
            new Item(guildID, 'Escudo de Ferro', false, new Date(), 'Escudo pesado feito de ferro', 6.0, 150, 2),
            new Item(guildID, 'Poção de Cura', true, new Date(), 'Recupera uma grande quantidade de saúde.', 0.5, 50, 3),
            new Item(guildID, 'Arco Longo', false, new Date(), 'Arco resistente para ataques à distância.', 2.0, 120, 4),
            new Item(guildID, 'Faca Dagger', true, new Date(), 'Uma faca pequena e afiada para combate rápido.', 1.2, 80, 5),
            new Item(guildID, 'Cajado Mágico', true, new Date(), 'Cajado encantado, utilizado por magos.', 1.8, 200, 6),
            new Item(guildID, 'Botas de Velocidade', false, new Date(), 'Botas que aumentam a velocidade do usuário.', 1.0, 75, 7),
            new Item(guildID, 'Anel da Sabedoria', true, new Date(), 'Anel que aumenta a inteligência do portador.', 0.1, 300, 8),
            new Item(guildID, 'Cinto de Força', false, new Date(), 'Aumenta a força física do portador.', 0.7, 150, 9),
            new Item(guildID, 'Coração de Dragão', true, new Date(), 'Um artefato mágico raro, fonte de grande poder.', 0.2, 500, 10),
            new Item(guildID, 'Poção de Invisibilidade', true, new Date(), 'Torna o usuário invisível por um tempo limitado.', 0.3, 180, 11),
            new Item(guildID, 'Machado de Batalha', false, new Date(), 'Um machado grande e pesado usado em combate corpo a corpo.', 5.0, 250, 12),
            new Item(guildID, 'Capa da Sombras', true, new Date(), 'Capa que proporciona camuflagem em ambientes escuros.', 1.0, 200, 13),
            new Item(guildID, 'Poção de Energia', true, new Date(), 'Restaura uma grande quantidade de energia.', 0.4, 90, 14),
            new Item(guildID, 'Espada Curta', false, new Date(), 'Espada de tamanho médio, ideal para combate rápido.', 2.5, 110, 15),
            new Item(guildID, 'Elmo de Ferro', false, new Date(), 'Elmo resistente para proteção da cabeça.', 1.5, 130, 16),
            new Item(guildID, 'Armadura de Couro', false, new Date(), 'Armadura leve feita de couro resistente.', 4.0, 170, 17),
            new Item(guildID, 'Pocão de Veneno', true, new Date(), 'Veneno letal que pode ser usado em armas.', 0.3, 60, 18),
            new Item(guildID, 'Estrela Cadente', true, new Date(), 'Fragmento de uma estrela caída, usada em feitiçarias.', 0.05, 400, 19),
            new Item(guildID, 'Luvas de Agilidade', false, new Date(), 'Aumenta a agilidade e destreza do portador.', 0.5, 120, 20),
            new Item(guildID, 'Espada de Aço', true, new Date(), 'Espada feita de aço, equilibrada para combate.', 2.8, 120, 21),
            new Item(guildID, 'Escudo de Madeira', false, new Date(), 'Escudo leve feito de madeira resistente.', 3.0, 90, 22),
            new Item(guildID, 'Poção de Mana', true, new Date(), 'Recupera uma grande quantidade de mana para magos.', 0.4, 70, 23),
            new Item(guildID, 'Besta de Caça', false, new Date(), 'Besta leve, ideal para caça e ataques à distância.', 2.2, 140, 24),
            new Item(guildID, 'Lâmina Curta', true, new Date(), 'Faca curta de lâmina afiada, perfeita para ataques rápidos.', 1.5, 60, 25),
            new Item(guildID, 'Cajado do Poder', true, new Date(), 'Cajado encantado com grande poder mágico.', 2.0, 250, 26),
            new Item(guildID, 'Botas de Armadilha', false, new Date(), 'Botas que deixam rastros de armadilhas em campos de batalha.', 1.6, 110, 27),
            new Item(guildID, 'Anel de Cura', true, new Date(), 'Anel mágico que regenera a saúde do portador.', 0.3, 220, 28),
            new Item(guildID, 'Cinto da Agilidade', false, new Date(), 'Cinto que aumenta a agilidade do portador.', 0.5, 100, 29),
            new Item(guildID, 'Coração de Fênix', true, new Date(), 'Um artefato raro que ressurge das chamas.', 0.2, 600, 30),
            new Item(guildID, 'Poção de Velocidade', true, new Date(), 'Aumenta temporariamente a velocidade do usuário.', 0.3, 130, 31),
            new Item(guildID, 'Machado de Guerra', false, new Date(), 'Machado pesado para combate corpo a corpo.', 4.5, 210, 32),
            new Item(guildID, 'Capa de Invisibilidade', true, new Date(), 'Capa mágica que torna o portador invisível.', 1.2, 250, 33),
            new Item(guildID, 'Poção de Força', true, new Date(), 'Aumenta temporariamente a força física do usuário.', 0.4, 100, 34),
            new Item(guildID, 'Espada de Fogo', false, new Date(), 'Espada mágica com lâmina flamejante.', 3.2, 180, 35),
            new Item(guildID, 'Elmo de Ouro', false, new Date(), 'Elmo de ouro que proporciona alta resistência.', 1.8, 200, 36),
            new Item(guildID, 'Armadura de Ferro', false, new Date(), 'Armadura pesada feita de ferro resistente.', 6.0, 300, 37),
            new Item(guildID, 'Poção de Veneno', true, new Date(), 'Veneno potente que pode ser usado em armas.', 0.3, 80, 38),
            new Item(guildID, 'Estrela de Gelo', true, new Date(), 'Fragmento mágico de gelo usado para feitiçarias.', 0.1, 350, 39),
            new Item(guildID, 'Luvas de Força', false, new Date(), 'Luvas que aumentam a força física do portador.', 0.8, 150, 40),
            new Item(guildID, 'Espada de Luz', true, new Date(), 'Espada mágica que emite uma lâmina luminosa.', 2.5, 230, 41),
            new Item(guildID, 'Escudo de Cristal', false, new Date(), 'Escudo feito de cristal encantado, altamente resistente.', 3.8, 170, 42),
            new Item(guildID, 'Poção de Regeneração', true, new Date(), 'Poção que regenera a saúde ao longo do tempo.', 0.4, 110, 43),
            new Item(guildID, 'Besta Pesada', false, new Date(), 'Besta forte, ideal para alvos grandes e distantes.', 3.0, 160, 44),
            new Item(guildID, 'Faca de Sombras', true, new Date(), 'Faca encantada que se dissolve na escuridão.', 1.3, 140, 45),
            new Item(guildID, 'Cajado de Gelo', true, new Date(), 'Cajado que controla o gelo e pode congelar inimigos.', 1.9, 220, 46),
            new Item(guildID, 'Botas de Mago', false, new Date(), 'Botas de couro que aumentam a regeneração de mana.', 1.0, 90, 47),
            new Item(guildID, 'Anel de Força', true, new Date(), 'Anel que aumenta a força física do portador.', 0.2, 200, 48),
            new Item(guildID, 'Cinto de Velocidade', false, new Date(), 'Cinto mágico que aumenta a velocidade do portador.', 0.6, 130, 49),
            new Item(guildID, 'Coração de Lua', true, new Date(), 'Artefato mágico raro com poder lunar.', 0.1, 550, 50),
            new Item(guildID, 'Poção de Barragem', true, new Date(), 'Poção que cria uma barreira mágica ao redor do usuário.', 0.5, 150, 51),
            new Item(guildID, 'Machado de Pedra', false, new Date(), 'Machado pesado feito de pedra, usado em combate físico.', 5.5, 230, 52),
            new Item(guildID, 'Capa do Destino', true, new Date(), 'Capa mágica que altera o destino do portador.', 1.0, 300, 53),
            new Item(guildID, 'Poção de Habilidade', true, new Date(), 'Aumenta temporariamente as habilidades de combate do usuário.', 0.6, 120, 54),
            new Item(guildID, 'Espada de Gelo', false, new Date(), 'Espada feita de gelo congelado, muito afiada.', 2.9, 190, 55),
            new Item(guildID, 'Elmo de Dragão', false, new Date(), 'Elmo encantado com escamas de dragão.', 2.0, 250, 56),
            new Item(guildID, 'Armadura de Platina', false, new Date(), 'Armadura de platina rara que oferece grande resistência.', 7.0, 350, 57),
            new Item(guildID, 'Poção de Elevação', true, new Date(), 'Poção que aumenta temporariamente as capacidades do usuário.', 0.4, 140, 58),
            new Item(guildID, 'Estrela do Caos', true, new Date(), 'Fragmento estelar que causa destruição ao ser usado.', 0.1, 400, 59),
            new Item(guildID, 'Luvas de Destreza', false, new Date(), 'Luvas que aumentam a destreza do portador.', 0.7, 110, 60),
            new Item(guildID, 'Livro Macabro', false, new Date(), `Um livro com um olho diabólico no meio de uma capa de couro manchada de sangue. 
            As lendas diziam que pertencia a um antigo mago que pereceu para o próprio feitiço proibido, que agora se encontra inscrito nas páginas rubras do caderno maldito.`, 1.5, 500, 61)];
        this.__items.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
    }

    getFromAutocomplete(guildID: string, query: string): Promise<Item[]> {
        if (query.length >= 1) {
            let filtered: Array<Item> = this.__items.filter((item) => item.guildID == guildID && item.name.trim().toLowerCase().includes(query.trim().toLowerCase()));
            return Promise.resolve(filtered.slice(0, Math.min(filtered.length, 20)));
        }
        return Promise.resolve([]);
    }

    getAll(guildID: string, depth: number = 1): Promise<Item[]> {
        let max_depth: number = Math.floor(this.__items.length/16.0);
        depth = depth > max_depth ? max_depth : depth < 1 ? 1 : depth;
        let end: number = depth * 16;
        let start: number = depth - 16;
        let filtered: Array<Item> = this.__items.filter((item) => item.guildID == guildID);
        return Promise.resolve<Item[]>(filtered.slice(start, end));
    }
    getItem(itemId: number): Promise<Item | null> {
        return Promise.resolve<Item>(this.__items.find((item) => item.ID == itemId));
    }

    getItemByName(guildID: string, itemName: string): Promise<Item | null> {
        let item = this.__items.find((item, i) => item.guildID == guildID && item.name.trim().toLowerCase() == itemName.trim().toLowerCase());
        return Promise.resolve(item);
    }

    addItem(item: Item): Promise<void> {
        item.ID = this.__items.length;
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