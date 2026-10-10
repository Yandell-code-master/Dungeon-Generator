import type { SpriteRef } from "../Util/SpriteReference";
import { Tile } from "./Tile";


export class FloorTile extends Tile {

    constructor() {
        super();
        this.pickSpriteTileReference();
    }

    public isWalkable(): boolean {
        return true;
    }

    protected pickSpriteTileReference(): void {
        const FLOOR_VARIANTS: SpriteRef[] = [
            { col: 0, row: 4 }, { col: 1, row: 4 }, { col: 2, row: 4 },
        ];

        this.spriteReference = FLOOR_VARIANTS[Math.floor(Math.random() * FLOOR_VARIANTS.length)];
    }
}