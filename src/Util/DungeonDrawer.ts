import { Dungeon } from '../Model/Dungeon';


// Esta clase está encargada de dibujar el mapa dungeon en el canvas
class DungeonDrawer {

    // La dungeon que va a dibujar
    private dungeon: Dungeon = null as unknown as Dungeon;
    private sprite: HTMLImageElement = new Image();

    constructor() {
        this.sprite.src = '/assets/tilemap_packed.png';
    }

    // Método encargado de dibujar el mapa dungeon
    // Recibe el contexto del lienzo en donde va a dibjar
    public drawDungeon(context: CanvasRenderingContext2D): void {
        let positionInX;
        let positionInY = 0;

        
        // Recorremos toda la matriz
        for (const row of this.dungeon.getMatrixTiles()) {     
            positionInX = 0; // Reiniciamos la coordenada en x para la nueva fila

            for (const tile of row) {

                // Dibujamos la celda correspondiente
                context.drawImage(this.sprite, tile.getSpriteReference.col * tile.getSize(), positionInY, tile.getSize(), tile.getSize(), );

                positionInX += tile.getSize(); // Posicion en x es movida la cantidad de pixeles que ocupa la celda
            }
            
            positionInY += row[0].getSize(); // Actualizamos la coordenada en y, teniendo en cuenta que las celdas tiene un tamaño fijo
        }
    }

    public setDungeon(dungeon:Dungeon): void {
        this.dungeon = dungeon;
    }

    public getSprite(): HTMLImageElement {
        return this.sprite;
    }
}

export { DungeonDrawer };







