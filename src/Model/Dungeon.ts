import { Tile } from './Tile';
import type { Corridor } from './Corridor';
import { Player } from './Player';
import { FogOfWar } from '../Util/FogOfWar';
import type { Enemy } from './Enemy';

// Esta es la clase que tiene la matriz 
export class Dungeon {
    // Tanto el width como el height tienen que ser en celdas de 32 pixeles
    private width: number;
    private height: number;
    private player: Player; 

    // Esta matriz representa el mapa del dungeon, donde cada celda contiene un valor numérico que indica el tipo de tile correspondiente.
    private matrixTileType: Tile[][];

    private corridors: Corridor[] = Array().fill(null);
    private fogOfWar: FogOfWar;
    private enemies: Enemy[] = [];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        // La matriz de tipo de celdas comienza vacía
        this.matrixTileType = Array(height).fill(null);

        this.player = new Player();
        this.fogOfWar = new FogOfWar(this.width, this.height, 6);
    }

    public isEnemyIn(col: number, row: number): boolean {
        for (let index = 0; index < this.enemies.length; index++) {
            const positionInX = this.enemies[index].getPosition().getPositionInX();
            const positionInY = this.enemies[index].getPosition().getPositionInY();

            if (positionInX == col && positionInY == row) {
                return true;
            }
        }

        return false;
    }

    public getEnemyAt(col: number, row: number): Enemy | undefined  {
        for (let index = 0; index < this.enemies.length; index++) {
            const positionInX = this.enemies[index].getPosition().getPositionInX();
            const positionInY = this.enemies[index].getPosition().getPositionInY();

            if (positionInX === col && positionInY === row) {
                return this.enemies[index];
            }
        }

        return undefined;
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

    public getFogOfWar(): FogOfWar {
        return this.fogOfWar;
    }

    public getEnemies(): Enemy[] {
        return this.enemies;
    }
}