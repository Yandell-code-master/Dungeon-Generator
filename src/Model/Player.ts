import { Point } from "./Point";
import { Tile } from "./Tile";

export class Player extends Tile {
    private position : Point = null as unknown as Point;

    constructor (x: number, y: number) {
        super();
        this.position = new Point(x, y);
        this.setColor('blue'); 
    }

    getPositionInX(): number { return this.position.getPositionInX(); }
    getPositionInY(): number { return this.position.getPositionInY(); }

    public moveTo(x: number, y: number): void {
        this.position.setPositionInX(x);
        this.position.setPositionInY(y);
    }
}