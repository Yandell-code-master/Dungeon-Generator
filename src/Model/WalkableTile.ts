import type { GameManager } from "../Util/GameManager";
import { Tile } from "./Tile";

export abstract class WalkableTile extends Tile {

    public isWalkable(): boolean {
        return true;
    }

    abstract onEnter(gameManager: GameManager): any;
}