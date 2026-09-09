import { Dungeon } from './Dungeon';
import { Tile } from './Tile';

// Esta clase está encargada de dibujar el mapa dungeon en el canvas
class DungeonDrawer {

    // La dungeon que va a dibujar
    Dungeon: Dungeon;

    constructor(dungeon: Dungeon) {
        this.Dungeon = dungeon;
    }

    // Método encargado de dibujar el mapa dungeon
    // Recibe el contexto del lienzo en donde va a dibjar
    public drawDungeon(context: CanvasRenderingContext2D): void {



        let positionInX;
        let positionInY = 0;
        let rowNumber = 0; 
        // Recorremos toda la matriz
        for (const row of this.Dungeon.matrixTileType) {     
            positionInX = 0; // Reiniciamos la coordenada en x para la nueva fila
            rowNumber++; // Incrementamos el número de fila actual

            for (const tile of row) {

                // Dibujamos la celda correspondiente
                context.fillStyle = tile.color;
                context.fillRect(positionInX, positionInY, tile.size, tile.size);

                positionInX += tile.size; // Posicion en x es movida la cantidad de pixeles que ocupa la celda
            }
            
            
            positionInY = rowNumber * row[0].size; // Actualizamos la coordenada en y, teniendo en cuenta que las celdas tiene un tamaño fijo
        }
    }
}

export { DungeonDrawer };







