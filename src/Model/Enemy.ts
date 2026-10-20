import { Entity } from "./Entity";

export class Enemy extends Entity {
    
    constructor() {
        super();
        this.pickSpriteReference();
    }

    protected pickSpriteReference(): void {
        super.setSpriteReference({col: 0, row: 9});
    }
}