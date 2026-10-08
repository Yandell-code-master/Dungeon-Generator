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
import { Player } from "../Model/Player";
import type { Tile } from "../Model/Tile";

export class DungeonCreator {
    private bSPTree: BSPTree;
    private dungeon: Dungeon;

    constructor(width: number, heigth: number) {
        this.dungeon = new Dungeon(width, heigth);
        this.bSPTree = new BSPTree(this.dungeon.getWidth(), this.dungeon.getHeight());
    }

    public createDungeon(): void {
        this.bSPTree.startTreeCreation();

        const bSPTreeLeaves: BSPNode[] = this.bSPTree.getLeaves();
        this.createRoomsInLeaves(bSPTreeLeaves);

        const allEdges = this.getEdges();
        const mandatoryEdges = this.getMandatoryEdges(allEdges);
        const optionalEdges = this.getOptionalEdges(mandatoryEdges, allEdges);
        this.createCorridors(mandatoryEdges, optionalEdges);

        this.fillMatrixWithWalls();
        this.buildRoomsInMatrixTiles();
        this.buildCorridorInMatrixTiles();

        const player = new Player();
        this.placePlayerInInitialPosition(player);
        this.dungeon.setPlayer(player);
        this.insertPlayerInDungeon(player.getPositionInX(), player.getPositionInY(), player, this.dungeon.getMatrixTiles());
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

            let roomPositionX = Math.floor(Math.random() * (leaf.getWidth() - roomWidth));
            let roomPositionY = Math.floor(Math.random() * (leaf.getHeight() - roomHeight));

            // console.log(roomPositionX, roomPositionY);

            // Le sumo uno a la posicion en x si es 0, esto es para que nunca aparezca pegada en su contenedor hoja.
            roomPositionX = roomPositionX == 0 ? roomPositionX + 1 + leaf.getPositionInX() : roomPositionX + leaf.getPositionInX();
            roomPositionY = roomPositionY == 0 ? roomPositionY + 1 + leaf.getPositionInY() : roomPositionY + leaf.getPositionInY();

            leaf.setRoom(new Room(roomPositionX, roomPositionY, roomWidth, roomHeight));
        }
    }

    private getMandatoryEdges(allEdges: Edge[]): Edge[] {
        const centerPoints: Point[] = this.getCenterPointsFromRooms();
        const kruskal = new Kruskal();
        const minimunSpaceTree: Edge[] = kruskal.getMSTWithKruskal(centerPoints, allEdges);

        return minimunSpaceTree;
    }

    private getEdges(): Edge[] {
        const centerPoints: Point[] = this.getCenterPointsFromRooms();

        const delaunayTriangle = Delaunator.from(centerPoints, (point) => point.getPositionInX(), (point) => point.getPositionInY());
        const graphConnected = delaunayTriangle.triangles;

        const triangles: Point[][] = Util.getPointsOfTriangles(graphConnected, centerPoints);
        return Util.getEdgesFromTriangles(triangles);
    }

    private getOptionalEdges(minimunSpaceTree: Edge[], edges: Edge[]): Edge[] {
        const mstSet = new Set<Edge>(minimunSpaceTree);
        const extraCandidates = edges.filter(edge => !mstSet.has(edge));

        const extraEdges = extraCandidates.filter(() => Math.random() < 0.15);
        return extraEdges;
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

    private buildLCorridor(start: Point, end: Point, horizontalFirst: boolean): Corridor {
        const corner = horizontalFirst
            ? new Point(end.getPositionInX(), start.getPositionInY())
            : new Point(start.getPositionInX(), end.getPositionInY());
        return new Corridor(start, corner, end);
    }

    private createCorridors(mandatoryEdges: Edge[], optionalEdges: Edge[]): void {
        const corridors: Corridor[] = [];
        const rooms: Room[] = this.getRoomsFromBSPTree();

        const tryEdge = (edge: Edge, isMandatory: boolean) => {
            const startPoint: Point = edge.getStartPoint();
            const endPoint: Point = edge.getEndPoint();
            const startRoom: Room | undefined = this.getRoomByCenterPoint(startPoint);
            const endRoom: Room | undefined = this.getRoomByCenterPoint(endPoint);

            if (!startRoom || !endRoom) {
                throw new Error("No se encontró la sala de un extremo de la arista");
            }

            const firstHorizontal: boolean = Math.random() < 0.5;
            const options = [
                this.buildLCorridor(startPoint, endPoint, firstHorizontal),
                this.buildLCorridor(startPoint, endPoint, !firstHorizontal),
            ];

            const corridorNotCrossing: Corridor | undefined = options.find(c => !this.corridorCrossesOtherRoom(c, rooms, startRoom, endRoom));

            if (corridorNotCrossing) {
                corridors.push(corridorNotCrossing);
            } else if (isMandatory) {
                corridors.push(options[0]); // necesario para la conectividad
            }
        }

        mandatoryEdges.forEach(edge => tryEdge(edge, true));
        optionalEdges.forEach(edge => tryEdge(edge, false));

        this.dungeon.setCorridors(corridors);
    }

    private corridorCrossesOtherRoom(
        corridorToCheck: Corridor,
        rooms: Room[], startRoom: Room, endRoom: Room
    ): boolean {
        const segments = [[corridorToCheck.getStart(), corridorToCheck.getCorner()], [corridorToCheck.getCorner(), corridorToCheck.getEnd()]];

        for (const [startPointOfSegment, endPointOfSegment] of segments) {
            const minX = Math.min(startPointOfSegment.getPositionInX(), endPointOfSegment.getPositionInX());
            const maxX = Math.max(startPointOfSegment.getPositionInX(), endPointOfSegment.getPositionInX());
            const minY = Math.min(startPointOfSegment.getPositionInY(), endPointOfSegment.getPositionInY());
            const maxY = Math.max(startPointOfSegment.getPositionInY(), endPointOfSegment.getPositionInY());

            for (const room of rooms) {
                if (room === startRoom || room === endRoom) continue;

                const startInX = room.getPositionInX();
                const endInX = startInX + room.getWidth() - 1;
                const startInY = room.getPositionInY();
                const endInY = startInY + room.getHeight() - 1;

                // intersección de rectángulos
                if ((minX <= endInX && maxX >= startInX) && (minY <= endInY && maxY >= startInY)) {
                    return true;
                }
            }
        }

        return false;
    }

    private getRoomByCenterPoint(centerPoint: Point): Room | undefined {
        const rooms = this.getRoomsFromBSPTree();

        for (const room of rooms) {
            const roomCenter = room.getCenterPoint();
            if (roomCenter.getPositionInX() === centerPoint.getPositionInX() && roomCenter.getPositionInY() === centerPoint.getPositionInY()) {
                return room;
            }
        }

        return undefined;
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
        matrixTileType = matrixTileType.map(() => Array.from({ length: this.dungeon.getWidth() }, () => new WallTile()));

        this.dungeon.setMatrixTiles(matrixTileType);
    }

    public getDungeon(): Dungeon {
        return this.dungeon;
    }

    public placePlayerInInitialPosition(player: Player): Player {
        const rooms = this.getRoomsFromBSPTree();
        const center = rooms[0].getCenterPoint();
        return player.moveTo(center.getPositionInX(), center.getPositionInY()), player;
    }

    public insertPlayerInDungeon(positionInX: number, positionInY: number, player: Player, matrixTiles: Tile[][] ): void {
        matrixTiles[player.getPositionInY()][player.getPositionInX()] = new FloorTile(); 
        player.moveTo(positionInX, positionInY);
        matrixTiles[positionInY][positionInX] = player;
    }

    public isMovePossible(positionInX: number, positionInY: number): boolean{
        const matrix = this.dungeon.getMatrixTiles();

        if (matrix[positionInY]?.[positionInX]?.isWalkable()) {
            return true;
        }

        return false;
    }
}