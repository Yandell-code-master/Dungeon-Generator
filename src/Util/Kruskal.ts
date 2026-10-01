import { Edge } from "../Model/Edge"
import { UnionFind } from "./UnionFind"
import { Point } from "../Model/Point";
import { Util } from "./Util";

export class Kruskal {
    public getMSTWithKruskal(points: Point[], edgesWithWeight: Edge[]): Edge[] {
        const unionFind: UnionFind = new UnionFind(points.length);
        const pointsIndexes = new Map<Point, number>();
        points.forEach((point, index) => pointsIndexes.set(point, index));

        edgesWithWeight.sort((firstEdge: Edge, secondEdge: Edge) => firstEdge.getWeight() - secondEdge.getWeight());

        const minimunSpaceTree: Edge[] = [];

        for (const edgeWithWeight of edgesWithWeight) {
            if (minimunSpaceTree.length === points.length - 1) {
                break;
            }

            let firstPointIndex = pointsIndexes.get(edgeWithWeight.getStartPoint());
            let secondPointIndex = pointsIndexes.get(edgeWithWeight.getEndPoint());

            if (firstPointIndex === undefined || secondPointIndex === undefined) {
                throw new Error("La arista contiene un punto que no está en la lista de puntos");
            }

            // Si lo logra unir entonces lo pone en el MST
            if (unionFind.union(firstPointIndex, secondPointIndex)) {
                minimunSpaceTree.push(edgeWithWeight);
            }
        }

        return minimunSpaceTree;
    }
}