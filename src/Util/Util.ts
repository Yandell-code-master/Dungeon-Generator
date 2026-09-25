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
}