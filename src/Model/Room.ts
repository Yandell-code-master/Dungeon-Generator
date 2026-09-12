/* 
Clase que representa una habitacion que esta dentro de una leaf especifica del arbol de BSPTree
*/

export class Room {
    private positionInX: number;
    private positionInY: number;
    private width: number;
    private height: number;

    // Las coordenanas para encontrar el centro de la habitación
    private positionInXRoomCenter: number = 0;
    private positionInYRoomCenter: number = 0;

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

    public setPositionInXRoomCenter(positionInXRoomCenter: number) {
        this.positionInXRoomCenter = positionInXRoomCenter;
    }

    public getPositionInXRoomCenter(): number {
        return this.positionInXRoomCenter;
    }

    public setPositionInYRoomCenter(positionInYRoomCenter: number) {
        this.positionInYRoomCenter = positionInYRoomCenter;
    }

    public getPositionInYRoomCenter(): number {
        return this.positionInYRoomCenter;
    }
}