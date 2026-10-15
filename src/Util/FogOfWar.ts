export class FogOfWar {
    private explored: boolean[][];

    private width: number;
    private height: number;
    private radius: number;

    constructor(width: number, height: number, radius: number = 6) {
        this.width = width;

        this.explored = Array.from({ length: height }, () =>
            Array.from({ length: width }, () => false)
        );
    }

    // Marca como explorado todo lo que está dentro del radio del jugador
    reveal(playerCol: number, playerRow: number): void {
        const r2 = this.radius * this.radius;

        for (let row = playerRow - this.radius; row <= playerRow + this.radius; row++) {
            for (let col = playerCol - this.radius; col <= playerCol + this.radius; col++) {
                if (row < 0 || col < 0 || row >= this.height || col >= this.width) continue;

                const dx = col - playerCol;
                const dy = row - playerRow;
                if (dx * dx + dy * dy <= r2) {
                    this.explored[row][col] = true;
                }
            }
        }
    }

    isExplored(col: number, row: number): boolean {
        return this.explored[row]?.[col] ?? false;
    }

    isVisible(col: number, row: number, playerCol: number, playerRow: number): boolean {
        const dx = col - playerCol;
        const dy = row - playerRow;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }
}