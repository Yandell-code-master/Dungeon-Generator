import { Dungeon } from './Dungeon';

// Esta clase está encargada de dibujar el mapa dungeon en el canvas
class DungeonDrawer {

    // La dungeon que va a dibujar
    private dungeon: Dungeon;

    constructor(dungeon: Dungeon) {
        this.dungeon = dungeon;
    }

    // Método encargado de dibujar el mapa dungeon
    // Recibe el contexto del lienzo en donde va a dibjar
    public drawDungeon(context: CanvasRenderingContext2D): void {



        let positionInX;
        let positionInY = 0;
        let rowNumber = 0; 
        // Recorremos toda la matriz
        for (const row of this.dungeon.getMatrixTiles()) {     
            positionInX = 0; // Reiniciamos la coordenada en x para la nueva fila
            rowNumber++; // Incrementamos el número de fila actual

            for (const tile of row) {

                // Dibujamos la celda correspondiente
                context.fillStyle = tile.getColor();
                context.fillRect(positionInX, positionInY, tile.getSize(), tile.getSize());

                positionInX += tile.getSize(); // Posicion en x es movida la cantidad de pixeles que ocupa la celda
            }
            
            
            positionInY = rowNumber * row[0].getSize(); // Actualizamos la coordenada en y, teniendo en cuenta que las celdas tiene un tamaño fijo
        }
    }
}

export { DungeonDrawer };







