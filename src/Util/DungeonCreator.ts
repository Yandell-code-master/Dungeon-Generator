/*Esta es la clase encargada de crear la dungeon, debe hacer todos los precesos para al final terminar devolviendo un objeto de tipo Dungeon con su respectiva matriz de celdas*/

import { BSPNode } from "./BSPNode";
import { BSPTree } from "./BSPTree";
import { Room } from "../Model/Room";
import { Point } from "../Model/Point"
import { Corridor } from "../Model/Corridor";
import { Dungeon } from "../Model/Dungeon";
import { WallTile } from "../Model/WallTile";
import { FloorTile } from "../Model/FloorTile";
import Delaunator from 'delaunator';
import { Edge } from "../Model/Edge";
import { Util } from "./Util";
import { Kruskal } from "./Kruskal";

export class DungeonCreator {
    private bSPTree: BSPTree;
    private dungeon: Dungeon;

    constructor(width: number, heigth: number) {
        this.dungeon = new Dungeon(width, heigth);
        this.bSPTree = new BSPTree(this.dungeon.getWidth(), this.dungeon.getHeigth());
    }

    public createDungeon(): void {
        this.bSPTree.startTreeCreation();

        const bSPTreeLeaves: BSPNode[] = this.bSPTree.getLeaves();
        this.createRoomsInLeaves(bSPTreeLeaves);

        const edgesToConnect = this.getEdgesToConnect();
        this.createCorridors(edgesToConnect);

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
            // El ancho y alto no serán igual al ancho y alto de las hojas que lo contienen
            const roomWidth = Math.floor(Math.random() * (leaf.getWidth() - minRoomWidth - 1)) + minRoomWidth;
            const roomHeight = Math.floor(Math.random() * (leaf.getHeight() - minRoomHeight - 1)) + minRoomHeight;


            /* Es una posicion aleatoria, la cual se elije con el espacio sobrantes tanto en ancho como en alto, entonces la room se va a ir moviendo entre esos espacios sobrantes
            por ejemplo:

            leaf.width = 10
            roomWidth = 5

            Entonces la posicion en x va a entre 0 y 5 ya que 10 - 5 = 5 y teniendo en cuenta que Math.random() da un numero entre 0 y 0.999 entonces el valor maximo seria 
            4.999 y luego se redondea hacia abajo a 4 y el minimo es 1 ya que a Math.random le sumamos 0.2 para que nunca de 0

            */
            let numberToMultiply: number = Math.random();


            let roomPositionX = Math.floor(numberToMultiply * (leaf.getWidth() - roomWidth));
            let roomPositionY = Math.floor(numberToMultiply * (leaf.getHeight() - roomHeight));

            // console.log(roomPositionX, roomPositionY);

            // Le sumo uno a la posicion en x si es 0, esto es para que nunca aparezca pegada en su contenedor hoja.
            roomPositionX = roomPositionX == 0 ? roomPositionX + 1 + leaf.getPositionInX() : roomPositionX + leaf.getPositionInX();
            roomPositionY = roomPositionY == 0 ? roomPositionY + 1 + leaf.getPositionInY() : roomPositionY + leaf.getPositionInY();

            console.log(roomPositionY, roomPositionX)

            leaf.setRoom(new Room(roomPositionX, roomPositionY, roomWidth, roomHeight));
        }
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

    private getEdgesToConnect(): Edge[] {
        const centerPoints: Point[] = this.getCenterPointsFromRooms();
        const edges: Edge[] = this.getEdges();
        const kruskal = new Kruskal();
        const minimumSpaceTree: Edge[] = kruskal.getMSTWithKruskal(centerPoints, edges);

        this.addCiclesToMST(minimumSpaceTree, edges);
        return minimumSpaceTree;
    }

    private getEdges(): Edge[] {
        const centerPoints: Point[] = this.getCenterPointsFromRooms();

        const delaunayTriangle = Delaunator.from(centerPoints, (point) => point.getPositionInX(), (point) => point.getPositionInY());
        const graphConnected = delaunayTriangle.triangles;

        const triangles: Point[][] = Util.getPointsOfTriangles(graphConnected, centerPoints);
        return Util.getEdgesFromTriangles(triangles);
    }

    private addCiclesToMST(minimumSpaceTree: Edge[], edges: Edge[]): Edge[] {
        const mstSet = new Set<Edge>(minimumSpaceTree);
        const extraCandidates = edges.filter(edge => !mstSet.has(edge));

        const extraEdges = extraCandidates.filter(() => Math.random() < 0.15);
        const corridorEdges = [...minimumSpaceTree, ...extraEdges];
        return corridorEdges;
    }


    private getRoomsFromBSPTree(): Room[] {
        const leaves = this.bSPTree.getLeaves();
        const rooms: Room[] = [];

        for (const leave of leaves) {
            const room = leave.getRoom();

            if (room) {
                rooms.push(room);
            }
        }

        return rooms;
    }

    private getCenterPointsFromRooms(): Point[] {
        const rooms = this.getRoomsFromBSPTree();
        const centerPoints: Point[] = [];

        for (const room of rooms) {
            centerPoints.push(room.getCenterPoint());
        }

        return centerPoints;
    }

    private createCorridors(edgesToUnite: Edge[]) {
        let cornerPoint: Point;
        const corridors: Corridor[] = [];


        for (const edge of edgesToUnite) {
            const startPoint: Point = edge.getStartPoint();
            const endPoint: Point = edge.getEndPoint();

            // Tiramos una moneda para decidir si el primer tramo es Horizontal o Vertical
            if (Math.random() < 0.5) {
                // Ruta 1: Moverse horizontalmente primero, luego verticalmente
                // La esquina comparte la X del destino (centerB) y la Y del origen (centerA)
                cornerPoint = new Point(endPoint.getPositionInX(), startPoint.getPositionInY())
            } else {
                // Ruta 2: Moverse verticalmente primero, luego horizontalmente
                // La esquina comparte la X del origen (centerA) y la Y del destino (centerB)

                cornerPoint = new Point(startPoint.getPositionInX(), endPoint.getPositionInY())
            }

            corridors.push(new Corridor(new Point(startPoint.getPositionInY(), startPoint.getPositionInY()), cornerPoint, new Point(endPoint.getPositionInX(), endPoint.getPositionInY())));
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