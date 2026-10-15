import type { GameManager } from "../Util/GameManager";
import type { SpriteRef } from "../Util/SpriteReference";
import { WalkableTile } from "./WalkableTile";


export class FloorTile extends WalkableTile {

    constructor() {
        super();
        this.pickSpriteTileReference();
    }

    protected pickSpriteTileReference(): void {
        const FLOOR_VARIANTS: SpriteRef[] = [
            { col: 0, row: 4 }, { col: 1, row: 4 }, { col: 2, row: 4 },
        ];

        this.spriteReference = FLOOR_VARIANTS[Math.floor(Math.random() * FLOOR_VARIANTS.length)];
    }

    public onEnter(gameManager: GameManager): any {
        return;
    }
}