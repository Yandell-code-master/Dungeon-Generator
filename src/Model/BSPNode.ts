
import { Room } from "./Room.ts";

export class BSPNode {

    // Coordenadas las cuales nos dicen en donde comienza a dibujarse el espacio que tiene el nodo. Recordar que esto es la ezquina superior izquierda del nodo.
    // Es importante tener en cuenta que las coordenadas tambien se maneja en celdas de 32 pixeles
    private positionInX: number;
    private positionInY: number;

    /*Este tamaño se refiere a celdas que cada celda es de 32 piexeles.*/
    private width: number;
    private height: number;

    private leftChild?: BSPNode = undefined;
    private rightChild?: BSPNode = undefined;

    // este es la referencia hacia la habitación que va a ser construida dentro de este nodo
    private room?: Room = undefined; 


    constructor(positionInX: number, positionInY: number, width: number, height: number) {
        this.positionInX = positionInX;
        this.positionInY = positionInY;
        this.width = width;
        this.height = height;
    }

    public getPositionInX(): number {
        return this.positionInX;
    }

    public setPositionIntX(positionInX: number): void {
        this.positionInX = positionInX;
    }

    public getPositionInY(): number {
        return this.positionInY;
    }

    public setPositionInY(positionInY: number): void {
        this.positionInY = positionInY;
    }

    public getWidth(): number {
        return this.width;
    }

    public setWidth(width: number): void {
        this.width = width;
    }

    public getHeight(): number {
        return this.height;
    }

    public setHeight(height: number): void {
        this.height = height;
    }

    public getLeftChild(): BSPNode | undefined {
        return this.leftChild;
    }

    public getRightChild(): BSPNode | undefined {
        return this.rightChild;
    }

    public setRightChild(rightChild: BSPNode | undefined): void {
        this.rightChild = rightChild;
    }

    public getRoom(): Room | undefined {
        return this.room;
    }

    public setRoom(room: Room | undefined): void {
        this.room = room;
    }
}