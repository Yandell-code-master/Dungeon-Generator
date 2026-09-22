export abstract class Tile {
    private size: number;
    private color: string;

    constructor() {
        this.size = 32; // Todos los tiles tiene le mismo tamaño
        this.color = "white" // valor predetermiado, aunque no importa por que los colores estan guardados en cada clase hija.
    }   

    public getSize(): number {
        return this.size;
    }

    public getColor(): string {
        return this.color;
    }

    protected setColor(color: string): void {
        this.color = color;
    }

    public setSize(size: number): void {
        this.size = size;
    }

}