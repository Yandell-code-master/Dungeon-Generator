import { Point } from "./Point";
import { Tile } from "./Tile";

export class Player extends Tile {
    private position : Point = new Point(0, 0);

    constructor () {
        super();
        this.pickPlayerSpriteReference();
    }

    getPositionInX(): number { return this.position.getPositionInX(); }
    getPositionInY(): number { return this.position.getPositionInY(); }

    public moveTo(x: number, y: number): void {
        this.position.setPositionInX(x);
        this.position.setPositionInY(y);
    }

    public isWalkable(): boolean {
        return false;
    }

    private pickPlayerSpriteReference(): void {
        this.spriteReference = { col: 0, row: 7 };
    }
}