import type { Dungeon } from "./Dungeon";
import { Entity } from "./Entity";
import { Player } from "./Player";

export class Enemy extends Entity {

    private detectionRadious = 6;

    constructor() {
        super();
        this.pickSpriteReference();
    }

    protected pickSpriteReference(): void {
        super.setSpriteReference({ col: 0, row: 9 });
    }

    private canSeePlayer(player: Player): boolean {
        const squaredDetectionRadius = this.detectionRadious * this.detectionRadious;

        const playerPositionInX = player.getPosition().getPositionInX();
        const playerPositionInY = player.getPosition().getPositionInY();

        const enemyPositionInX = super.getPosition().getPositionInX();
        const enemyPositionInY = super.getPosition().getPositionInY();

        const distanceInX = playerPositionInX - enemyPositionInX;
        const distanceInY = playerPositionInY - enemyPositionInY;

        const squaredEucladianDistance = distanceInX * distanceInX + distanceInY * distanceInY;

        return squaredEucladianDistance <= squaredDetectionRadius;
    }

    public moveDependingOnPlayerPosition(player: Player, dungeon: Dungeon): void {
        if (this.canSeePlayer(player)) {
            this.stepTowardPlayer(player, dungeon);
            return;
        }

        this.moveRandomly(dungeon);
    }

    private moveRandomly(dungeon: Dungeon): void {
        const directions: [number, number][] = [[0, -1], [0, 1], [-1, 0], [1, 0]];

        const [distanceToMoveX, distanceToMoveY] = directions[Math.floor(Math.random() * directions.length)];

        const position = this.getPosition();
        const newPositionX = position.getPositionInX() + distanceToMoveX;
        const newPositionY = position.getPositionInY() + distanceToMoveY;

        const isMoveValid = dungeon.isCellWalkableForEnemy(newPositionX, newPositionY);

        if (isMoveValid) {
            this.moveTo(newPositionX, newPositionY);
            return;
        }
    }

    private stepTowardPlayer(player: Player, dungeon: Dungeon): void {
        const enemyPosition = this.getPosition();
        const playerPosition = player.getPosition();

        const distanceEnemyFromPlayerX = playerPosition.getPositionInX() - enemyPosition.getPositionInX();
        const distanceEnemyFromPlayerY = playerPosition.getPositionInY() - enemyPosition.getPositionInY();

        const stepX = Math.sign(distanceEnemyFromPlayerX);
        const stepY = Math.sign(distanceEnemyFromPlayerY);

        /* El enemigo se movera en el eje el cual falten más pasos para alcanzar al jugador, esto 
        se podría hacer de otra forma no es obligatorio que sea así */
        const candidates: [number, number][] =
            Math.abs(distanceEnemyFromPlayerX) >= Math.abs(distanceEnemyFromPlayerY)
                ? [[stepX, 0], [0, stepY]]
                : [[0, stepY], [stepX, 0]];

        for (const [mx, my] of candidates) {
            if (mx === 0 && my === 0) continue;

            const newPositionX = enemyPosition.getPositionInX() + mx;
            const newPositionY = enemyPosition.getPositionInY() + my;

            const isTileWalkable = dungeon.isTileWalkable(newPositionX, newPositionY);
            const isEnemyIn = dungeon.isEnemyIn(newPositionX, newPositionY);

            if (isTileWalkable && !isEnemyIn) {
                this.moveTo(newPositionX, newPositionY);
                return;
            }
        }
    }

    private tryMoveBy(dx: number, dy: number, dungeon: Dungeon): boolean {
        const pos = this.getPosition();
        const nx = pos.getPositionInX() + dx;
        const ny = pos.getPositionInY() + dy;

        if (!dungeon.isCellWalkableForEnemy(nx, ny)) return false;

        this.moveTo(nx, ny);
        return true;
    }
}