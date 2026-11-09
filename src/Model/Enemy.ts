import type { Dungeon } from "./Dungeon";
import { Entity } from "./Entity";
import type { Player } from "./Player";

export class Enemy extends Entity {

    private detectionRadious = 6;

    constructor() {
        super();
        this.pickSpriteReference();
    }

    protected pickSpriteReference(): void {
        super.setSpriteReference({ col: 0, row: 9 });
    }

    private canSeePlayer(player: Player, dungeon: Dungeon): boolean {
        const squaredDetectionRadius = this.detectionRadious * this.detectionRadious;

        const playerPositionInX = player.getPosition().getPositionInX();
        const playerPositionInY = player.getPosition().getPositionInY();

        const enemyPositionInX = super.getPosition().getPositionInX();
        const enemyPositionInY = super.getPosition().getPositionInY();

        const distanceInX = playerPositionInX - enemyPositionInX;
        const distanceInY = playerPositionInY - enemyPositionInY;

        const squaredEucladianDistance = distanceInX * distanceInX + distanceInY * distanceInY;

        return squaredEucladianDistance <= squaredDetectionRadius && this.hasLineOfSight(player, dungeon);
    }

    private hasLineOfSight(player: Player, dungeon: Dungeon): boolean {
        let positionInX = super.getPosition().getPositionInX();
        let positionInY = super.getPosition().getPositionInY();

        const playerPositionInX = player.getPosition().getPositionInX();
        const playerPositionInY = player.getPosition().getPositionInY();

        const distanceInX = Math.abs(playerPositionInX - positionInX);
        const distanceInY = Math.abs(playerPositionInY - positionInY);

        const stepInX = positionInX < playerPositionInX ? 1 : -1;
        const stepInY = positionInY < playerPositionInY ? 1 : -1;

        let error = distanceInX - distanceInY;

        /* Bresenham entre el enemigo y el jugador: cualquier muro intermedio corta la visión.
        Usamos isTileWalkable como proxy de transparencia, igual que hace el resto del juego */
        while (positionInX !== playerPositionInX || positionInY !== playerPositionInY) {
            const doubledError = 2 * error;

            if (doubledError > -distanceInY) {
                error -= distanceInY;
                positionInX += stepInX;
            }

            if (doubledError < distanceInX) {
                error += distanceInX;
                positionInY += stepInY;
            }

            // La celda del jugador no bloquea su propia visión
            if (positionInX === playerPositionInX && positionInY === playerPositionInY) {
                break;
            }

            if (!dungeon.isTileWalkable(positionInX, positionInY)) {
                return false;
            }
        }

        return true;
    }

    public moveDependingOnPlayerPosition(player: Player, dungeon: Dungeon): void {
        if (this.canSeePlayer(player, dungeon)) {
            this.stepTowardPlayer(player, dungeon);
            return;
        }

        this.moveRandomly(dungeon);
    }

    public moveRandomly(dungeon: Dungeon): void {
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

            /* isCellWalkableForEnemy ya excluye muros, al jugador y a otros enemigos,
            así que el enemigo nunca puede acabar encima del jugador */
            if (dungeon.isCellWalkableForEnemy(newPositionX, newPositionY)) {
                this.moveTo(newPositionX, newPositionY);
                return;
            }
        }

        /* Si ya está pegado al jugador se queda quieto para no pisarlo ni oscilar.
        Si no, intenta un paso aleatorio para no quedarse atascado */
        const isAdjacentToPlayer = Math.abs(distanceEnemyFromPlayerX) <= 1 && Math.abs(distanceEnemyFromPlayerY) <= 1;

        if (!isAdjacentToPlayer) {
            this.moveRandomly(dungeon);
        }
    }
}