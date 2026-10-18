import { Dungeon } from '../Model/Dungeon';
import { Camara } from './Camara';
import { Player } from '../Model/Player';
import type { SpriteRef } from './SpriteReference';
import { TransparentTile } from '../Model/TransparentTile';
import { Tile } from '../Model/Tile';
import { Point } from '../Model/Point';
import { FogOfWar } from './FogOfWar';
import type { Enemy } from '../Model/Enemy';

// Esta clase está encargada de dibujar el mapa dungeon en el canvas
class DungeonDrawer {

    // La dungeon que va a dibujar
    private dungeon: Dungeon = null as unknown as Dungeon;
    private sprite: HTMLImageElement = new Image();
    private camara: Camara;
    private context: CanvasRenderingContext2D;
    private spriteTileSize: number = 16;
    private tileSize: number = 32;
    private fogOfWar: FogOfWar = null as unknown as FogOfWar;
    private enemies: Enemy[] = this.dungeon.getEnemies();

    constructor(camara: Camara, context: CanvasRenderingContext2D) {
        this.sprite.src = '/assets/tilemap_packed.png';
        this.camara = camara;
        this.context = context;
    }

    public drawCamaraView(): void {
        const matrixTiles = this.dungeon.getMatrixTiles();
        const player: Player = this.dungeon.getPlayer();
        const playerPosition: Point = player.getPosition();
        const playerPositionX: number = playerPosition.getPositionInX();
        const playerPositionY: number = playerPosition.getPositionInY();


        const { camPositionX, camPositionY } = this.camara.getCameraView(this.dungeon.getPlayer(), this.dungeon.getWidth(), this.dungeon.getHeight());

        for (let camaraRow = 0; camaraRow < this.camara.getViewHeight(); camaraRow++) {
            for (let camaraCol = 0; camaraCol < this.camara.getViewWidth(); camaraCol++) {
                const worldPositionX = camPositionX + camaraCol;
                const worldPositionY = camPositionY + camaraRow;

                const tile = matrixTiles[worldPositionY]?.[worldPositionX];
                const isTileTransparent: boolean = tile instanceof TransparentTile;
                if (!tile) continue;

                if (!this.fogOfWar.isExplored(worldPositionX, worldPositionY)) {
                    this.drawFog(camaraCol, camaraRow, 1)
                    continue;
                }

                this.drawTile(tile, camaraCol, camaraRow, isTileTransparent);
                
                if (this.dungeon.isEnemyIn(worldPositionX, worldPositionY)) {
                    this.drawTile();
                }

                if (!this.fogOfWar.isVisible(worldPositionX, worldPositionY, playerPositionX, playerPositionY)) {
                    this.drawFog(camaraCol, camaraRow, 0.6);
                }


            }
        }



        const playerScreenCol = playerPosition.getPositionInX() - camPositionX;
        const playerScreenRow = playerPosition.getPositionInY() - camPositionY;

        this.drawTile(player, playerScreenCol, playerScreenRow);
    }

    private drawFog(screenCol: number, screenRow: number, opacity: number): void {
        this.context.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        this.context.fillRect(
            screenCol * this.tileSize,
            screenRow * this.tileSize,
            this.tileSize,
            this.tileSize
        );
    }

    private drawTile(tile: any, screenCol: number, screenRow: number, isTransparent: boolean = false): void {
        if (isTransparent) {
            const transparentTile: TransparentTile = tile as TransparentTile;
            const baseSprite: SpriteRef = transparentTile.getBaseSprite();

            this.drawSprite(baseSprite, screenCol, screenRow);
        }

        const spriteReference: SpriteRef = tile.getSpriteReference();
        this.drawSprite(spriteReference, screenCol, screenRow);
    }


    private drawSprite(spriteReference: SpriteRef, screenCol: number, screenRow: number) {
        this.context.drawImage(
            this.sprite,
            spriteReference.col * this.spriteTileSize,
            spriteReference.row * this.spriteTileSize,
            this.spriteTileSize,
            this.spriteTileSize,
            screenCol * this.tileSize,
            screenRow * this.tileSize,
            this.tileSize,
            this.tileSize
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

    public setFogOfWar(fogOfWar: FogOfWar): void {
        this.fogOfWar = fogOfWar;
    }
}

export { DungeonDrawer };







