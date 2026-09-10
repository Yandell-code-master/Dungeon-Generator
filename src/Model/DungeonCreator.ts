/*Esta es la clase encargada de crear la dungeon, debe hacer todos los precesos para al final terminar devolviendo un objeto de tipo Dungeon con su respectiva matriz de celdas*/

import { BSPTree } from "./BSPTree";
import { Room } from "./Room";

export class DungeonCreator {
    private bSPTree: BSPTree;

    constructor(bSPTree: BSPTree = new BSPTree()) {
        this.bSPTree = bSPTree;
    }

    public CreateRooms(): void {
        const leaves = this.bSPTree.getLeaves();
        
        for (const leaf of leaves) {
            /* 
            Obtenemos un valores de ancho y alto minimos los cuales pueden ser tanto la mitad de lo que tiene la leaf o tres, en este caso estamos hablando de celdas
            */
            const minRoomWidth = Math.max(3, Math.floor(leaf.getWidth() * 0.5));
            const minRoomHeight = Math.max(3, Math.floor(leaf.getHeight() * 0.5));

            // Ancho y alto aleatorios dentro de los límites del nodo
            const roomWidth = Math.floor(Math.random() * (leaf.getWidth() - minRoomWidth)) + minRoomWidth;
            const roomHeight = Math.floor(Math.random() * (leaf.getHeight() - minRoomHeight)) + minRoomHeight;

            /* Es una posicion aleatoria, la cual se elije con el espacio sobrantes tanto en ancho como en alto, entonces la room se va a ir moviendo entre de esos espacios sobrantes
            por ejemplo:

            leaf.width = 10
            roomWidth = 5

            Entonces la posicion en x va a entre 0 y 4 ya que 10 - 5 + 1 = 6 y teniendo en cuenta que Math.random() da un numero entre 0 y 0.999 entonces el valor maximo seria 
            5.99 y luego se redondea hacia abajo a 5

            por lo que se puede ver que la room puede aparecer pegada completamente a la izquierda en el caso de que math.random() sea igual a 0 o completamente a la derecha 
            en el caso de que sea 0.99
            */
            const roomPositionX = leaf.getPositionInX() + Math.floor(Math.random() * (leaf.getWidth() - roomWidth + 1));
            const roomPositionY = leaf.getPositionInY() + Math.floor(Math.random() * (leaf.getHeight() - roomHeight + 1));

            leaf.setRoom(new Room(roomPositionX, roomPositionY, roomWidth, roomHeight));
        }

    }
}