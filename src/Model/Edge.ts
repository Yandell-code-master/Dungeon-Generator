import type { PointAndIndex } from "../Util/PointAndIndex";

export class Edge {
    private weight: number;
    private startPoint: PointAndIndex;
    private endPoint: PointAndIndex;

    constructor(weight: number, startPoint: PointAndIndex, endPoint: PointAndIndex) {
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

    public getStartPoint(): PointAndIndex {
        return this.startPoint;
    }

    public setStartPoint(startPoint: PointAndIndex) {
        this.startPoint = startPoint;
    }

    public getEndPoint(): PointAndIndex {
        return this.endPoint;
    }

    public setEndPoint(endPoint: PointAndIndex){
        this.endPoint = endPoint;
    }
}