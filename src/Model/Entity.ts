import type { SpriteRef } from "../Util/SpriteReference";
import { Point } from "./Point";

export abstract class Entity {
    private position: Point;
    private spritReference: SpriteRef;

    constructor() {
        this.position = new Point(0, 0);
        this.spritReference = { col: 0, row: 0 };
    }

    protected abstract pickSpriteReference(): void;

    public moveTo(x: number, y: number): void {
        this.getPosition().setPositionInX(x);
        this.getPosition().setPositionInY(y);
    }

    public setPosition(position: Point) {
        this.position = position;
    }

    public getPosition(): Point {
        return this.position;
    }

    public setSpriteReference(spriteReference: SpriteRef) {
        this.spritReference = spriteReference;
    }

    public getSpriteReference(): SpriteRef {
        return this.spritReference;
    }
}