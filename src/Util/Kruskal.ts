import { Edge } from "../Model/Edge"
import { UnionFind } from "./UnionFind"
import { Point } from "../Model/Point";
import { Util } from "./Util";

class Kruskal {
    public getMSTWithKruskal(points: Point[], edgesWithWeight: Edge[]): Edge[] {
        const unionFind: UnionFind = new UnionFind(points.length);
        edgesWithWeight.sort((firstEdge: Edge, secondEdge: Edge) => firstEdge.getWeight() - secondEdge.getWeight());

        const minimunSpaceTree: Edge[] = [];

        for (const edgeWithWeight of edgesWithWeight) {
            if (minimunSpaceTree.length === points.length - 1) {
                break;
            }

            let firstPointIndex: number = this.getPointIndex(points, edgeWithWeight.getStartPoint());
            let secondPointIndex: number = this.getPointIndex(points, edgeWithWeight.getEndPoint());


            // Si lo logra unir entonces lo pone en el MST
            if (unionFind.union(firstPointIndex, secondPointIndex)) {
                minimunSpaceTree.push(edgeWithWeight);
            }
        }

        return minimunSpaceTree;
    }


}