import { DungeonDrawer } from "./DungeonDrawer";
import { DungeonCreator } from "./DungeonCreator";
import { Camara } from "./Camara";
import type { Dungeon } from "../Model/Dungeon";
import type { Player } from "../Model/Player";
import { Point } from "../Model/Point";
import { Tile } from "../Model/Tile";

export class GameManager {
    private dungeonCreator: DungeonCreator = new DungeonCreator(100, 100);
    private canvasContext: CanvasRenderingContext2D = (document.getElementById('canvasElement') as HTMLCanvasElement).getContext('2d')!;
    private dungeonDrawer: DungeonDrawer = new DungeonDrawer(new Camara(25, 15), this.canvasContext);

    private levelQuantity: number = 1;
    private dungeon: Dungeon = null as unknown as Dungeon;

    constructor() {
        this.canvasContext.imageSmoothingEnabled = false;
    }

    public startFirstLevel(): void {
        this.dungeon = this.dungeonCreator.createDungeon();
        this.dungeonDrawer.setDungeon(this.dungeon);
        this.renderDungeon();
    }

    public goToNextLevel(): void {
        this.levelQuantity++;

        this.dungeonCreator.createDungeon();
        this.renderDungeon();
    }

    public isSpriteLoad(): boolean {
        return this.dungeonDrawer.getSprite().complete;
    }

    public isDungeonAlreadyCreated(): boolean {
        return this.dungeonCreator.getDungeon() !== undefined;
    }

    public renderDungeon(): void {
        this.dungeonDrawer.drawCamaraView();
    }

    public getPlayer(): Player {
        return this.dungeon.getPlayer();
    }

    public movePlayer(move: number[]): void {
        const player: Player = this.dungeon.getPlayer();
        const newPositionX = player.getPosition().getPositionInX() + move[0];
        const newPositionY = player.getPosition().getPositionInY() + move[1];

        if (!this.dungeonCreator.movePlayerInDungeon(newPositionX, newPositionY)) {
            return;
        }  

        this.getOnEnterTileEffect();

        this.renderDungeon();
    }

    public getOnEnterTileEffect() {
        const matrixTile: Tile[][] = this.dungeon.getMatrixTiles()
        const playerPosition: Point = this.dungeon.getPlayer().getPosition();
        const tilePlayerIsOn: Tile = matrixTile[playerPosition.getPositionInX()][playerPosition.getPositionInY()];

        tilePlayerIsOn.onEnter(this);
    }
}