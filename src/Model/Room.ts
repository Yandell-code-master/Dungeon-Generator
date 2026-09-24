import {Point} from "./Point";


/* 
Clase que representa una habitacion que esta dentro de una hoja especifica del arbol de BSPTree
*/

export class Room {
    private positionInX: number;
    private positionInY: number;
    private width: number;
    private height: number;

    // Las coordenanas para encontrar el centro de la habitación, comienzan en 0 luego les asignamos valor
    private centerPoint: Point = new Point(0, 0);

    constructor(positionInX: number, positionInY: number, width: number, height: number) {
        this.positionInX = positionInX;
        this.positionInY = positionInY;
        this.width = width;
        this.height = height;
    }

    public getPositionInX(): number {
        return this.positionInX
    }

    public getPositionInY(): number {
        return this.positionInY
    }

    public getWidth(): number {
        return this.width
    }

    public getHeight(): number {
        return this.height
    }

    public setCenterPoint(centerPoint: Point) {
        this.centerPoint = centerPoint;
    }

    public getCenterPoint(): Point {
        return this.centerPoint;
    }
}