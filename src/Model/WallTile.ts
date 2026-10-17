import { NoneWalkableTile } from "./NoneWalkableTile";

export class WallTile extends NoneWalkableTile {
    constructor() {
        super();
        this.pickSpriteTileReference();
    }

    protected pickSpriteTileReference(): void {
        this.spriteReference = { col: 4, row: 3 }; 
    }
}