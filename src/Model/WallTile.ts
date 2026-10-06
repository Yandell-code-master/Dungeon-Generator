import type { SpriteRef } from "../Util/SpriteReference";
import { Tile } from "./Tile";

export class WallTile extends Tile {
    constructor() {
        super();
        this.pickWallSpriteReference();
    }

    public isWalkable(): boolean {
        return false;
    }

    private pickWallSpriteReference(): void {
        this.spriteReference = { col: 4, row: 3 }; 
    }
}