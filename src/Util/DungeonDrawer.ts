import { Dungeon } from '../Model/Dungeon';
import { Camara } from './Camara';
import { Player } from '../Model/Player';

// Esta clase está encargada de dibujar el mapa dungeon en el canvas
class DungeonDrawer {

    // La dungeon que va a dibujar
    private dungeon: Dungeon = null as unknown as Dungeon;
    private sprite: HTMLImageElement = new Image();
    private camara: Camara;

    constructor(camaraWidht: number, camaraHeight: number) {
        this.sprite.src = '/assets/tilemap_packed.png';
        this.camara = new Camara(camaraWidht, camaraHeight);
    }

    public drawCamaraView(context: CanvasRenderingContext2D): void {
        const spriteTileSize = 16;
        const matrixTiles = this.dungeon.getMatrixTiles();

        const { camPositionX, camPositionY } = this.camara.getCameraView(this.dungeon.getPlayer(), this.dungeon.getWidth(), this.dungeon.getHeight());

        // 3. Recorrer solo las celdas de la pantalla
        for (let camaraRow = 0; camaraRow < this.camara.getViewHeight(); camaraRow++) {
            for (let camaraCol = 0; camaraCol < this.camara.getViewWidth(); camaraCol++) {
                // 4. Qué celda del mundo toca mostrar aquí
                const worldPositionX = camPositionX + camaraCol;
                const worldPositionY = camPositionY + camaraRow;
                const tile = matrixTiles[worldPositionY]?.[worldPositionX];
                if (!tile) continue;

                const { col, row } = tile.getSpriteReference();

                context.drawImage(
                    this.sprite,
                    col * spriteTileSize,
                    row * spriteTileSize,
                    spriteTileSize,
                    spriteTileSize,
                    camaraCol * tile.getSize(),
                    camaraRow * tile.getSize(),
                    tile.getSize(),
                    tile.getSize()
                );
            }
        }

        const player: Player = this.dungeon.getPlayer();
        const playerSize: number = player.getSize();
        const { col: spriteCol, row: spriteRow } = player.getSpriteReference();

        const playerScreenCol = player.getPositionInX() - camPositionX;
        const playerScreenRow = player.getPositionInY() - camPositionY;

        context.drawImage(
            this.sprite,
            spriteCol * spriteTileSize,
            spriteRow * spriteTileSize,
            spriteTileSize,
            spriteTileSize,
            playerScreenCol * playerSize,
            playerScreenRow * playerSize,
            playerSize,
            playerSize
        );
    }

    public drawDungeon(context: CanvasRenderingContext2D) {
        let positionInX;
        let positionInY = 0;
        const spriteTileSize = 16;

        // Recorremos toda la matriz
        for (const row of this.dungeon.getMatrixTiles()) {
            positionInX = 0; // Reiniciamos la coordenada en x para la nueva fila

            for (const tile of row) {

                // Dibujamos la celda correspondiente
                context.drawImage(this.sprite, tile.getSpriteReference().col * spriteTileSize, tile.getSpriteReference().row * spriteTileSize, spriteTileSize, spriteTileSize, positionInX, positionInY, tile.getSize(), tile.getSize());

                positionInX += tile.getSize(); // Posicion en x es movida la cantidad de pixeles que ocupa la celda
            }

            positionInY += row[0].getSize(); // Actualizamos la coordenada en y, teniendo en cuenta que las celdas tiene un tamaño fijo
        }
    }

    public setDungeon(dungeon: Dungeon): void {
        this.dungeon = dungeon;
    }

    public getSprite(): HTMLImageElement {
        return this.sprite;
    }
}

export { DungeonDrawer };







