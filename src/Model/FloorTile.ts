import type { SpriteRef } from "../Util/SpriteReference";
import { Tile } from "./Tile";


export class FloorTile extends Tile {
    constructor() {
        const spriteReference: SpriteRef = { col: 0, row: 4 };
        super(spriteReference);
        this.setColor('gray'); // Color predeterminado para los tiles de piso
    }

    public isWalkable(): boolean {
        return true;
    }
}