import type { Point } from "./Point";

export class Edge {
    private weight: number;
    private startPoint: Point;
    private endPoint: Point;

    constructor(weight: number, startPoint: Point, endPoint: Point) {
        this.weight = weight;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }

    public getWeight(): number {
        return this.weight;
    }

    public setWeight(weight: number) {
        this.weight = weight;
    }

    public getStartPoint(): Point{
        return this.startPoint;
    }

    public setStartPoint(startPoint: Point) {
        this.startPoint = startPoint;
    }

    public getEndPoint(): Point {
        return this.endPoint;
    }

    public setEndPoint(endPoint: Point){
        this.endPoint = endPoint;
    }
}