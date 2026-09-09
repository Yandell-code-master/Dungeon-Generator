import { Dungeon } from './Model/Dungeon';
import { DungeonDrawer } from './Model/DungeonDrawer';
import { BSPTree } from './Model/BSPTree';


// Trae el boton que inicializa la generacion del mapa
const generateButton = document.getElementById('generateButton') as HTMLButtonElement;

generateButton.addEventListener('click', () => {
    const dungeon = new Dungeon(5, 2);
    const drawer = new DungeonDrawer(dungeon);

    const canvasContext = (document.getElementById('canvasElement') as HTMLCanvasElement).getContext('2d');

    if ( canvasContext === null) {
        throw new Error('Was imposible to get canvas context');
    }

    // Dibujamos el mapa dungeon en el canvas
    drawer.drawDungeon(canvasContext);
});
