import { DungeonDrawer } from "./DungeonDrawer";
import { DungeonCreator } from "./DungeonCreator";
import { Camara } from "./Camara";
import type { Dungeon } from "../Model/Dungeon";
import type { Player } from "../Model/Player";
import { Point } from "../Model/Point";
import { Tile } from "../Model/Tile";
import type { WalkableTile } from "../Model/WalkableTile";
import { FogOfWar } from "./FogOfWar";
import type { Enemy } from "../Model/Enemy";

export class GameManager {
    private dungeonCreator: DungeonCreator = new DungeonCreator(100, 100);
    private canvasContext: CanvasRenderingContext2D = (document.getElementById('canvasElement') as HTMLCanvasElement).getContext('2d')!;
    private dungeonDrawer: DungeonDrawer = new DungeonDrawer(new Camara(25, 15), this.canvasContext);

    private levelQuantity: number = 1;
    private dungeon: Dungeon = null as unknown as Dungeon;
    private fogOfWar: FogOfWar = null as unknown as FogOfWar;
    private player: Player = null as unknown as Player;

    constructor() {
        this.canvasContext.imageSmoothingEnabled = false;
    }

    public startFirstLevel(): void {
        this.dungeon = this.dungeonCreator.createDungeon();
        this.dungeonDrawer.setDungeon(this.dungeon);

        this.fogOfWar = this.dungeon.getFogOfWar();
        this.fogOfWar.restartFog();
        this.dungeonDrawer.setFogOfWar(this.fogOfWar);

        this.player = this.dungeon.getPlayer();

        const playerPositionX: number = this.dungeon.getPlayer().getPosition().getPositionInX();
        const playerPositionY: number = this.dungeon.getPlayer().getPosition().getPositionInY();

        this.fogOfWar.reveal(playerPositionX, playerPositionY);
        this.renderDungeon();
    }

    public goToNextLevel(): void {
        this.levelQuantity++;
        this.dungeonCreator.createDungeon();
        this.fogOfWar.restartFog();
        this.renderDungeon();
    }

    private moveEnemies(): void {
        for (const enemy of this.dungeon.getEnemies()) {
            const directions: [number, number][] = [[0, -1], [0, 1], [-1, 0], [1, 0]];
            const [distanceToMoveX, distanceToMoveY] = directions[Math.floor(Math.random() * directions.length)];

            const pos = enemy.getPosition();
            const newPositionX = pos.getPositionInX() + distanceToMoveX;
            const newPositionY = pos.getPositionInY() + distanceToMoveY;

            if (this.dungeonCreator.isMovePossible(newPositionX, newPositionY)) {
                enemy.moveTo(newPositionX, newPositionY);
            }
        }
    }

    private canEnemySeePlayer(enemy: Enemy): boolean {
        const squaredDetectionRadius = 6 * 6;

        const playerPositionInX = this.player.getPosition().getPositionInX();
        const playerPositionInY = this.player.getPosition().getPositionInY();

        const enemyPositionInX = enemy.getPosition().getPositionInX();
        const enemyPositionInY = enemy.getPosition().getPositionInY();

        const distanceInX = playerPositionInX - enemyPositionInX;
        const distanceInY = playerPositionInY - enemyPositionInY;

        const squaredEucladianDistance = distanceInX * distanceInX + distanceInY * distanceInY;

        return squaredEucladianDistance <= squaredDetectionRadius;
    }

    private stepTowardPlayer(enemy: Enemy): void {
        const e = enemy.getPosition();
        const p = this.dungeon.getPlayer().getPosition();

        const dx = p.getPositionInX() - e.getPositionInX();
        const dy = p.getPositionInY() - e.getPositionInY();

        const stepX = Math.sign(dx);   // -1, 0 o 1
        const stepY = Math.sign(dy); 

        // Eje principal primero, el otro como alternativa
        const candidates: [number, number][] =
            Math.abs(dx) >= Math.abs(dy)
                ? [[stepX, 0], [0, stepY]]
                : [[0, stepY], [stepX, 0]];

        for (const [mx, my] of candidates) {
            if (mx === 0 && my === 0) continue;   // no hay movimiento en ese eje

            const nx = e.getPositionInX() + mx;
            const ny = e.getPositionInY() + my;

            if (this.dungeon.isCellFree(nx, ny)) {
                enemy.moveTo(nx, ny);
                return;
            }
        }
        // Si ambos están bloqueados, se queda quieto
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

        this.fogOfWar.reveal(newPositionX, newPositionY);
        this.moveEnemies();
        this.getOnEnterTileEffect();
        this.renderDungeon();
    }

    public getOnEnterTileEffect() {
        const matrixTile: Tile[][] = this.dungeon.getMatrixTiles();
        const playerPosition: Point = this.dungeon.getPlayer().getPosition();
        const tilePlayerIsOn: WalkableTile = matrixTile[playerPosition.getPositionInY()][playerPosition.getPositionInX()] as WalkableTile;

        tilePlayerIsOn.onEnter(this);
    }
}