import { Dungeon } from './Model/Dungeon';
import { DungeonDrawer } from './Util/DungeonDrawer';
import { DungeonCreator } from './Util/DungeonCreator';
import { Camara } from './Util/Camara';


// Trae el boton que inicializa la generacion del mapa
const dungeonGenerationButton = document.getElementById('generateButton') as HTMLButtonElement;
const dungeonDrawer: DungeonDrawer = new DungeonDrawer(25, 15);
const dungeonCreator: DungeonCreator = new DungeonCreator(100, 100);
const canvasContext = (document.getElementById('canvasElement') as HTMLCanvasElement).getContext('2d');
const camara: Camara = new Camara(25, 15);


if (canvasContext) {
    canvasContext.imageSmoothingEnabled = false;
}


function isSpriteLoad(): boolean {
    if (!dungeonDrawer.getSprite().complete) {
        return false;
    }

    return true;
}

dungeonGenerationButton.addEventListener('click', () => {
    if (!isSpriteLoad()) {
        return;
    }

    dungeonCreator.createDungeon();
    renderDungeon();
});

function renderDungeon() {
    const dungeon: Dungeon = dungeonCreator.getDungeon();
    dungeonDrawer.setDungeon(dungeon);

    if (!canvasContext) {
        return;
    }

    dungeonDrawer.drawCamaraView(canvasContext);
}

function isDungeonAlreadyCreated(): boolean {
    return dungeonCreator.getDungeon() !== undefined;
}

window.addEventListener("keydown", (e) => {
    if (!isDungeonAlreadyCreated()) {
        return;
    }

    const player = dungeonCreator.getDungeon().getPlayer();

    const moves: Record<string, [number, number]> = {
        ArrowUp: [0, -1], ArrowDown: [0, 1],
        ArrowLeft: [-1, 0], ArrowRight: [1, 0],
        w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
    };

    const move = moves[e.key];
    if (!move) return;

    const newPositionX = player.getPositionInX() + move[0];
    const newPositionY = player.getPositionInY() + move[1];

    if (!dungeonCreator.movePlayerInDungeon(newPositionX, newPositionY)) {
        return;
    }

    renderDungeon();
});
