import { Tile } from "./Tile";

export class WallTile extends Tile {
    constructor() {
        super();
        this.setColor('brown'); // Color predeterminado para los tiles de pared
    }
}