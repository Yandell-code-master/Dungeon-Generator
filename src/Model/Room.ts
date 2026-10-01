import {Point} from "./Point";


/* 
Clase que representa una habitacion que esta dentro de una hoja especifica del arbol de BSPTree
*/

export class Room {
    private positionInX: number;
    private positionInY: number;
    private width: number;
    private height: number;
    private centerPoint: Point = null as unknown as Point;

    constructor(positionInX: number, positionInY: number, width: number, height: number) {
        this.positionInX = positionInX;
        this.positionInY = positionInY;
        this.width = width;
        this.height = height;
        this.calculateCenterPoint();
    }
    
    private calculateCenterPoint() {
        const centerX = this.positionInX + Math.floor(this.width / 2);
        const centerY = this.positionInY + Math.floor(this.height / 2);
        this.centerPoint = new Point(centerX, centerY);
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

    public getCenterPoint(): Point {
        return this.centerPoint;
    }
}