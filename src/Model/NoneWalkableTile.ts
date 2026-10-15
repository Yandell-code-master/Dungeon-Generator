import { Tile } from "./Tile";

export abstract class NoneWalkableTile extends Tile {

    public isWalkable(): boolean {
        return false;
    }

}