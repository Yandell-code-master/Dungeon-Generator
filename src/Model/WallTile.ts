import type { SpriteRef } from "../Util/SpriteReference";
import { Tile } from "./Tile";

export class WallTile extends Tile {
    constructor() {
        const spriteReference: SpriteRef = { col: 0, row: 0 }; 
        super(spriteReference);
        this.setColor('brown'); // Color predeterminado para los tiles de pared
    }

    public isWalkable(): boolean {
        return false;
    }
}