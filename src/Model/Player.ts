import { Entity } from "./Entity";

export class Player extends Entity {

    constructor () {
        super();
        this.pickSpriteReference();
    }



    protected pickSpriteReference(): void {
        super.setSpriteReference({ col: 0, row: 7 });
    }
}