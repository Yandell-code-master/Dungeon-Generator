import { Tile } from './Tile';
import type { Corridor } from './Corridor';
import type { Player } from './Player';

// Esta es la clase que tiene la matriz 
export class Dungeon {
    // Tanto el width como el height tienen que ser en celdas de 32 pixeles
    private width: number;
    private height: number;
    private player: Player = null as unknown as Player; 

    // Esta matriz representa el mapa del dungeon, donde cada celda contiene un valor numérico que indica el tipo de tile correspondiente.
    private matrixTileType: Tile[][];

    private corridors: Corridor[] = Array().fill(null);

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        // La matriz de tipo de celdas comienza vacía
        this.matrixTileType = Array(height).fill(null);
    }


    public getWidth(): number {
        return this.width;
    }

    public getHeight():number {
        return this.height;
    }

    public getMatrixTiles(): Tile[][] {
        return this.matrixTileType;
    }

    public setMatrixTiles(matrixTileType: Tile[][]) {
        this.matrixTileType = matrixTileType;
    }

    public getCorridors(): Corridor[] {
        return this.corridors;
    }

    public setCorridors(corridors: Corridor[]) {
        this.corridors = corridors;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public setPlayer(player: Player): void {
        this.player = player;
    }
}