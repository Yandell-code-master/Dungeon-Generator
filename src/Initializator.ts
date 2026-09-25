import { Dungeon } from './Model/Dungeon';
import { DungeonDrawer } from './Util/DungeonDrawer';
import { DungeonCreator } from './Util/DungeonCreator';


// Trae el boton que inicializa la generacion del mapa
const generateButton = document.getElementById('generateButton') as HTMLButtonElement;

generateButton.addEventListener('click', () => {
    let dungeonCreator: DungeonCreator = new DungeonCreator(59, 25);
    dungeonCreator.createDungeon();
    let dungeon: Dungeon = dungeonCreator.getDungeon();
    let dungeonDrawer: DungeonDrawer = new DungeonDrawer(dungeon);

    const canvasContext = (document.getElementById('canvasElement') as HTMLCanvasElement).getContext('2d');

    if (!canvasContext) {
        return;
    }

    dungeonDrawer.drawDungeon(canvasContext);
});
