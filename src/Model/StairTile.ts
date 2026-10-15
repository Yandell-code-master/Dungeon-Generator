import type { GameManager } from '../Util/GameManager';
import { WalkableTile } from './WalkableTile';

export class StairTile extends WalkableTile {

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

    public onEnter(gameManager: GameManager) {
        gameManager.goToNextLevel();
    }
}