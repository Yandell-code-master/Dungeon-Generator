import { Edge } from "../Model/Edge";
import { Point } from "../Model/Point";

export class Util {


    public static ecladianDistance(startPoint: Point, endPoint: Point): number {
        const startPositionInX = startPoint.getPositionInX();
        const endPositionInX = endPoint.getPositionInX();

        const startPositionInY = startPoint.getPositionInY();
        const endPositionInY = endPoint.getPositionInY();

        const distanceInX = startPositionInX - endPositionInX;
        const distanceInY = startPositionInY - endPositionInY;

        // Distancia Eucladiana
        return Math.sqrt((distanceInX * distanceInX) + (distanceInY * distanceInY));
    }

    public static getEdgesFromTriangles(triangles: Point[][]): Edge[] {
        const edges: Edge[] = [];

        for (const triangle of triangles) {
            const firstVertex = triangle[0];
            const secondVertex = triangle[1];
            const thirdVertex = triangle[2];

            edges.push(new Edge(Util.ecladianDistance(firstVertex, secondVertex), firstVertex, secondVertex));
            edges.push(new Edge(Util.ecladianDistance(secondVertex, thirdVertex), secondVertex, thirdVertex));
            edges.push(new Edge(Util.ecladianDistance(thirdVertex, firstVertex), thirdVertex, firstVertex));
        }

        return edges;
    }

    // Devuelve una lista con tres puntos cada uno es el vertice de un triangulo especifico
    public static getPointsOfTriangles(graphConnected: Uint32Array<ArrayBuffer>, centerPoints: Point[]): Point[][] {
        const triangleQuantity: number = graphConnected.length / 3;
        let triangles: Point[][] = [];

        for (let t = 0; t < triangleQuantity; t++) {
            const triangle: Point[] = [
                centerPoints[graphConnected[t * 3]],
                centerPoints[graphConnected[t * 3 + 1]],
                centerPoints[graphConnected[t * 3 + 2]],
            ];
            triangles.push(triangle);
        }

        return triangles;
    }
}