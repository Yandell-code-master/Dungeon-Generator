import type { SpriteRef } from '../Util/SpriteReference';
import { TransparentTile } from './TransparentTile';

export class StairTile extends TransparentTile {

    constructor() {
        // Floor like base sprtie
        const baseSprite: SpriteRef = {col: 0, row: 4}
        super(baseSprite);
        this.pickSpriteTileReference();
    }

    protected pickSpriteTileReference(): void {
        this.spriteReference = {col: 7, row: 4}
    }

    public isWalkable(): boolean {
        return true;
    }

    public onEnter() {
        
    }
}