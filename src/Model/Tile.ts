import {type SpriteRef} from '../Util/SpriteReference';

export abstract class Tile {
    private size: number;
    protected spriteReference: SpriteRef = null as unknown as SpriteRef;

    constructor() {
        this.size = 32; // Todos los tiles tiene le mismo tamaño
    }   

    public getSize(): number {
        return this.size;
    }

    public setSize(size: number): void {
        this.size = size;
    }

    public abstract isWalkable(): boolean;

    public getSpriteReference(): SpriteRef {
        return this.spriteReference;
    }
}