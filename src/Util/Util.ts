import { Edge } from "../Model/Edge";
import { Point } from "../Model/Point";
import type { PointAndIndex } from "./PointAndIndex";

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

    public static getEdgesFromTriangles(triangles: PointAndIndex[][]): Edge[] {
        const edges: Edge[] = [];

        for (const triangle of triangles) {
            const firstVertex = triangle[0].point;
            const secondVertex = triangle[1].point;
            const thirdVertex = triangle[2].point;

            edges.push(new Edge(Util.ecladianDistance(firstVertex, secondVertex), firstVertex, secondVertex));
            edges.push(new Edge(Util.ecladianDistance(secondVertex, thirdVertex), secondVertex, thirdVertex));
            edges.push(new Edge(Util.ecladianDistance(thirdVertex, firstVertex), thirdVertex, firstVertex));
        }

        return edges;
    }

    // Devuelve una lista con tres indices de tres puntos que forman el triangulo 
    public static getPointsOfTriangles(graphConnected: Uint32Array<ArrayBuffer>, centerPoints: Point[]): number[][] {
        const triangleQuantity: number = graphConnected.length / 3;
        let triangles: PointAndIndex[][] = [];

        for (let t = 0; t < triangleQuantity; t++) {
            const triangle: PointAndIndex[] = [
                // Recordar que graphConnected tiene indices de los puntos de la lista que le pasamos a delaunator
                {point: centerPoints[graphConnected[t * 3]], index: graphConnected[t * 3]},
                {point: centerPoints[graphConnected[t * 3 + 1]], index: graphConnected[t * 3 + 1]},
                {point: centerPoints[graphConnected[t * 3 + 2]], index: graphConnected[t * 3 + 2]},
            ];

            triangles.push(triangle);
        }

        return triangles;
    }
}