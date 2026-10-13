import { Dungeon } from './Model/Dungeon';
import { GameManager } from './Util/GameManager';

const dungeonGenerationButton = document.getElementById('generateButton') as HTMLButtonElement;
const gameManager: GameManager = new GameManager();

dungeonGenerationButton.addEventListener('click', () => {
    if (!gameManager.isSpriteLoad()) {
        return
    }

    gameManager.startFirstLevel();
});


window.addEventListener("keydown", (e) => {
    if (!gameManager.isDungeonAlreadyCreated()) {
        return;
    }

    const moves: Record<string, [number, number]> = {
        ArrowUp: [0, -1], ArrowDown: [0, 1],
        ArrowLeft: [-1, 0], ArrowRight: [1, 0],
        w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
    };

    const move = moves[e.key];
    if (!move) return;

    gameManager.movePlayer(move);
});
