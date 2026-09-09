// Este es el tipo de tile que ponemos fuera de la dungeon

import { Tile } from "./Tile";

export class OutTheDungeonTile extends Tile {

    constructor() {
        super();
        this.setColor('black'); // Color predeterminado para los tiles fuera de la dungeon
    }
}