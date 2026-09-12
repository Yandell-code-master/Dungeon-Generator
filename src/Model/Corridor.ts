import type {Point} from "./Point";

export class Corridor {
    private start: Point;  
    private corner: Point; 
    private end: Point;   

    constructor(start: Point, corner: Point, end: Point) {
        this.start = start;
        this.corner = corner;
        this.end = end;
    }

    public getStart(): Point {
        return this.start;
    }

    public setStart(start: Point): void {
        this.start = start;
    }

    public getCorner(): Point {
        return this.corner;
    }

    public setCorner(corner: Point): void {
        this.corner = corner;
    }

    public getEnd(): Point {
        return this.end;
    }

    public setEnd(end: Point): void {
        this.end = end;
    }
}