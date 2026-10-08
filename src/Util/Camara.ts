import { Player } from "../Model/Player";


export class Camara {
    private viewWidth: number;
    private viewHeight: number;

    constructor(viewWidth: number, viewHeight: number) {
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
    }


    public clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(value, max));

    }
    public getCameraView(player: Player, mapWidth: number, mapHeight: number) {
        const camPositionX = this.clamp(player.getPositionInX() - Math.floor(this.getViewWidth() / 2), 0, mapWidth - this.getViewWidth());
        const camPositionY = this.clamp(player.getPositionInY() - Math.floor(this.getViewHeight() / 2), 0, mapHeight - this.getViewHeight());
        return { camPositionX, camPositionY};
    }

    public getViewWidth(): number {
        return this.viewWidth;
    }   

    public getViewHeight(): number {
        return this.viewHeight;
    }
}