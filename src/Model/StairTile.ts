import { Tile } from './Tile'

export class StairTile extends Tile {

    constructor() {
        super();
        this.pickSpriteTileReference();
    }

    protected pickSpriteTileReference(): void {
        this.spriteReference = {col: 7, row: 4}
    }

    public isWalkable(): boolean {
        return true;
    }
}