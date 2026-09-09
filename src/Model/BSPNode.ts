/*
Esta es la clase que crea la forma en que se divide la dungeon.

Funciona de manera recursiva, dividiendo el mapa en dos partes hasta que ya los espacios sean demasiado pequeños para dividirse (son demasiados pequeños cuando
son más pequeños que 'minSize').

Cada división es un nodo, esto es un arbol binario, osea que cada nodo tiene dos hijos.
*/
export class BSPNode {

    // Coordenadas las cuales nos dicen en donde comienza a dibujarse el espacio que tiene el nodo. Recordar que esto es la ezquina superior izquierda del nodo.
    public x: number;
    public y: number;

    /*Este tamaño se refiere a celdas que cada celda es de 32 piexeles.*/
    public width: number;
    public height: number;
    public leftChild?: BSPNode;
    public rightChild?: BSPNode;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}