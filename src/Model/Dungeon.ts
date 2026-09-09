import { Tile } from './Tile';
import { FloorTile } from './FloorTile';
import { WallTile } from './WallTile';
import { OutTheDungeonTile } from './OutTheDungeonTile';

// Esta es la clase que tiene la matriz 
export class Dungeon {
    private width: number;
    private height: number;
    private rooms: number;

    // Esta matriz representa el mapa del dungeon, donde cada celda contiene un valor numérico que indica el tipo de tile correspondiente.
    public matrixTileType: Tile[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.rooms = 0;

        // Aqui estamos creando una dungeon statica para empezar
        this.matrixTileType = [[new FloorTile(), new FloorTile(), new FloorTile(), new FloorTile(), new FloorTile()],
                                [new FloorTile(), new FloorTile(), new FloorTile(), new FloorTile(), new FloorTile()]];
    }

    public CreateDungeon(): void {
        // Aqui se implementaria la logica para crear un dungeon dinamico
    }

    
}

export default Dungeon;