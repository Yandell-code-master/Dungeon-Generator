import {Edge} from "../Model/Edge"
import {UnionFind} from "./UnionFind"

class Kruskal {
    public static getMSTWithKruskal(points: number[][], edgesWithWeight: Edge[]): Edge[] {
        const unionFind: UnionFind = new UnionFind();
        edgesWithWeight.sort( (firstEdge: Edge, secondEdge: Edge) => firstEdge.getWeight()  - secondEdge.getWeight());

        const mst: Edge[] = [];

        for (const edgeWithEdge of edgesWithWeight) {


            if (uf.union(u, v)) { 
                mst.push({ u, v, peso });
            }
        }

        return mst;
    }
}