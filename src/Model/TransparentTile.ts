import type { SpriteRef } from '../Util/SpriteReference'
import {Tile} from './Tile'

export abstract class TransparentTile extends Tile {
    protected baseSprite: SpriteRef;

    constructor(baseSprite: SpriteRef) {
        super();
        this.baseSprite = baseSprite;
    }

    public getBaseSprite() {
        return this.baseSprite
    }
}