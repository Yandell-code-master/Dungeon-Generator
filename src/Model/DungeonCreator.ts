/*Esta es la clase encargada de crear la dungeon, debe hacer todos los precesos para al final terminar devolviendo un objeto de tipo Dungeon con su respectiva matriz de celdas*/

import { BSPNode } from "./BSPNode";
import { BSPTree } from "./BSPTree";
import { Room } from "./Room";
import { Point } from "./Point"
import { Corridor } from "./Corridor";
import { Dungeon } from "./Dungeon";
import { WallTile } from "./WallTile";
import { FloorTile } from "./FloorTile";

export class DungeonCreator {
    private bSPTree: BSPTree;
    private dungeon: Dungeon;

    constructor(width: number, heigth: number) {
        this.dungeon = new Dungeon(width, heigth);
        this.bSPTree = new BSPTree(this.dungeon.getWidth(), this.dungeon.getHeigth());
    }

    public createDungeon() {
        this.bSPTree.startTreeCreation();

        const bSPTreeLeaves: BSPNode[] = this.bSPTree.getLeaves();
        this.createRoomsInLeaves(bSPTreeLeaves);

        const rooms: Room[] = this.getRoomsFromBSPTree();
        this.setCenterPointsRooms(rooms);

        const representantsToUnite: BSPNode[][] = [];
        this.getAndSaveRepresentants(this.bSPTree.getRoot(), representantsToUnite);

        const roomsToUnite: Room[][] = [];

        for (const pair of representantsToUnite) {
            const leftRoom = pair[0].getRoom();
            const rigthRoom = pair[1].getRoom();

            if (leftRoom && rigthRoom) {
                roomsToUnite.push([leftRoom, rigthRoom]);
            }
        }

        this.createCorridors(roomsToUnite);

        this.fillMatrixWithWalls();
        this.buildRoomsInMatrixTiles();
        this.buildCorridorInMatrixTiles();
    }

    private createRoomsInLeaves(leaves: BSPNode[]): void {

        for (const leaf of leaves) {
            /* 
            Obtenemos un valores de ancho y alto minimos los cuales pueden ser tanto la mitad de lo que tiene la leaf o tres, en este caso estamos hablando de celdas
            */
            const minRoomWidth = Math.max(3, Math.floor(leaf.getWidth() * 0.5));
            const minRoomHeight = Math.max(3, Math.floor(leaf.getHeight() * 0.5));

            // Ancho y alto aleatorios dentro de los límites del nodo
            const roomWidth = Math.floor(Math.random() * (leaf.getWidth() - minRoomWidth)) + minRoomWidth;
            const roomHeight = Math.floor(Math.random() * (leaf.getHeight() - minRoomHeight)) + minRoomHeight;

            /* Es una posicion aleatoria, la cual se elije con el espacio sobrantes tanto en ancho como en alto, entonces la room se va a ir moviendo entre esos espacios sobrantes
            por ejemplo:

            leaf.width = 10
            roomWidth = 5

            Entonces la posicion en x va a entre 0 y 5 ya que 10 - 5 = 5 y teniendo en cuenta que Math.random() da un numero entre 0 y 0.999 entonces el valor maximo seria 
            4.999 y luego se redondea hacia abajo a 4 y el minimo es 1 ya que a Math.random le sumamos 0.2 para que nunca de 0

            */
            let numberToMultiply: number = Math.random();

            if (numberToMultiply < 0.3) {
                console.log(numberToMultiply)
                numberToMultiply += 0.5;
            }

            const roomPositionX = leaf.getPositionInX() + Math.floor(numberToMultiply  * (leaf.getWidth() - roomWidth));
            const roomPositionY = leaf.getPositionInY() + Math.floor(numberToMultiply * (leaf.getHeight() - roomHeight));

            leaf.setRoom(new Room(roomPositionX, roomPositionY, roomWidth, roomHeight));
        }
    }

    private isLeave(node: BSPNode): Boolean {
        // Por lo que sabemos que si almenos uno de los hijos tiene algo adentro ambos hijos tendran también por lo que es un arbol binario, por lo que solamente es necesario revisar uno
        return node.getLeftChild() ? false : true
    }

    /*Lo que hace esta función no solamente devuelve el representantes de un grupo, sino que mientras los va encontrando los a guardando en una lista, cada representante es un par en una lista*/
    private getAndSaveRepresentants(node: BSPNode, listsOfRepresentants: BSPNode[][] = []): BSPNode {
        const leftChild = node.getLeftChild();
        const rigthChild = node.getRightChild();

        // Revisamos que sus hijos sean undefined, esto también es para que typscript nos deje despues poder usar estas variables como BSPNode
        // En el caso de que sean undefined devolvemos el mismo nodo ya que el es el representante al ser una hoja
        if (!leftChild || !rigthChild) {
            return node;
        }

        // Buscamos ambos competidores aqui en donde se aplica la recursividad
        let leftCompetitor: BSPNode = this.getAndSaveRepresentants(leftChild, listsOfRepresentants);
        let rigthCompetitor: BSPNode = this.getAndSaveRepresentants(rigthChild, listsOfRepresentants);

        listsOfRepresentants.push([leftCompetitor, rigthCompetitor])

        if (Math.random() <= 0.5) {
            return leftCompetitor;
        }

        return rigthCompetitor;
    }

    private getRoomsFromBSPTree(): Room[] {
        const leaves = this.bSPTree.getLeaves();
        const rooms: Room[] = [];

        for (const leave of leaves) {
            const room = leave.getRoom();

            // Contemplamos que la room no sea undefined antes de poder hacer push 
            // Aunque no puede ser undefined pero el compilador nos lo pide igual
            if (room) {
                rooms.push(room);
            }
        }

        return rooms;
    }

    private setCenterPointsRooms(rooms: Room[]) {

        for (const room of rooms) {

            /*Dividimos el ancho de la room a la mitad y le sumamos la posicion en donde se comienza a dibujar 
            la habitacion asi obtenemos en la coordenada x en donde esta el centro de la habitación */
            room.setPositionInXRoomCenter(Math.floor(room.getPositionInX() + (room.getWidth() / 2)));


            room.setPositionInYRoomCenter(Math.floor(room.getPositionInY() + (room.getHeight() / 2)));
        }
    }

    private createCorridors(pairsRoomsToUnite: Room[][]) {
        let cornerPoint: Point;
        const corridors: Corridor[] = [];


        for (const pairRoomsToUnite of pairsRoomsToUnite) {
            const roomStart: Room = pairRoomsToUnite[0];
            const roomEnd: Room = pairRoomsToUnite[1];

            // Tiramos una moneda para decidir si el primer tramo es Horizontal o Vertical
            if (Math.random() < 0.5) {
                // Ruta 1: Moverse horizontalmente primero, luego verticalmente
                // La esquina comparte la X del destino (centerB) y la Y del origen (centerA)
                cornerPoint = new Point(roomEnd.getPositionInXRoomCenter(), roomStart.getPositionInYRoomCenter())
            } else {
                // Ruta 2: Moverse verticalmente primero, luego horizontalmente
                // La esquina comparte la X del origen (centerA) y la Y del destino (centerB)

                cornerPoint = new Point(roomStart.getPositionInXRoomCenter(), roomEnd.getPositionInYRoomCenter())
            }

            corridors.push(new Corridor(new Point(roomStart.getPositionInXRoomCenter(), roomStart.getPositionInYRoomCenter()), cornerPoint, new Point(roomEnd.getPositionInXRoomCenter(), roomEnd.getPositionInYRoomCenter())));
        }

        this.dungeon.setCorridors(corridors);
    }

    private buildRoomsInMatrixTiles() {
        const rooms: Room[] = this.getRoomsFromBSPTree();
        const matrixTileType = this.dungeon.getMatrixTiles();

        for (const room of rooms) {

            /* La variable de este bucle va a iniciar en donde incia la habitacion en x, y continuará mientras que la variable sea
            menor a donde comienza en x mas el ancho, haciendo así que se repita la cantidad de celdas que necesita en ancho */
            for (let x = room.getPositionInX(); x < room.getPositionInX() + room.getWidth(); x++) {

                for (let y = room.getPositionInY(); y < room.getPositionInY() + room.getHeight(); y++) {
                    matrixTileType[y][x] = new FloorTile();
                }
            }
        }
    }

    private buildCorridorInMatrixTiles() {
        const corridors = this.dungeon.getCorridors();
        let matrixTiles = this.dungeon.getMatrixTiles();


        for (const corridor of corridors) {
            const start = corridor.getStart();
            const corner = corridor.getCorner();
            const end = corridor.getEnd();

            // 1. Tramo desde Start hasta Corner
            const minX1 = Math.min(start.getPositionInX(), corner.getPositionInX());
            const maxX1 = Math.max(start.getPositionInX(), corner.getPositionInX());
            const minY1 = Math.min(start.getPositionInY(), corner.getPositionInY());
            const maxY1 = Math.max(start.getPositionInY(), corner.getPositionInY());

            for (let y = minY1; y <= maxY1; y++) {
                for (let x = minX1; x <= maxX1; x++) {
                    matrixTiles[y][x] = new FloorTile();
                }
            }

            // 2. Tramo desde Corner hasta End
            const minX2 = Math.min(corner.getPositionInX(), end.getPositionInX());
            const maxX2 = Math.max(corner.getPositionInX(), end.getPositionInX());
            const minY2 = Math.min(corner.getPositionInY(), end.getPositionInY());
            const maxY2 = Math.max(corner.getPositionInY(), end.getPositionInY());

            for (let y = minY2; y <= maxY2; y++) {
                for (let x = minX2; x <= maxX2; x++) {
                    matrixTiles[y][x] = new FloorTile();
                }
            }
        }
    }

    private fillMatrixWithWalls() {
        let matrixTileType = this.dungeon.getMatrixTiles();

        //Llenamos cada fila de la matriz con la cantidad respectivas de celdas de tipo wall
        matrixTileType = matrixTileType.map(() => Array(this.dungeon.getWidth()).fill(new WallTile()))

        this.dungeon.setMatrixTiles(matrixTileType);
    }

    public getDungeon(): Dungeon {
        return this.dungeon;
    }
}