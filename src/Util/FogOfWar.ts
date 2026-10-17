export class FogOfWar {
    private explored: boolean[][] = null as unknown as boolean[][];

    private width: number;
    private height: number;
    private radius: number;

    constructor(width: number, height: number, radius: number = 6) {
        this.width = width;
        this.height = height;
        this.radius = radius;

        this.initializeFogMatrix(height, width)
    }

    private initializeFogMatrix(height: number, width: number): void {
        this.explored = Array.from({ length: height }, () =>
            Array.from({ length: width }, () => false)
        );
    }

    // Marca como explorado todo lo que está dentro del radio del jugador
    public reveal(playerCol: number, playerRow: number): void {
        const squaredRadio = this.radius * this.radius;

        /* Los valores row y col valores iniciales de 6 celdas hacia la izquierda y hacia arriba respectivamente del jugador
        esto se hace para ir recorriendo las celdas que forman un rectangulo*/
        for (let row = playerRow - this.radius; row <= playerRow + this.radius; row++) {
            for (let col = playerCol - this.radius; col <= playerCol + this.radius; col++) {

                // Se saltan las celdas que no estan dentro de la matriz como celdas con indices menores que 0 o igual a la longitud
                if (row < 0 || col < 0 || row >= this.height || col >= this.width) continue;

                const distanceFromPlayerX = col - playerCol;
                const distanceFromPlayerY = row - playerRow;

                /* Aquí usamos la distancia eucladiana al cuadrado por eso es que subimos el radio al cuadrado para no tener
                que sacar la raiz de la distancia*/
                if (distanceFromPlayerX * distanceFromPlayerX + distanceFromPlayerY * distanceFromPlayerY <= squaredRadio) {
                    this.explored[row][col] = true;
                }
            }
        }
    }

    public isExplored(col: number, row: number): boolean {

        /* Si this.exploredd[row] es undefined en vez de que se intente acceder a una indice de un undefined evalua todo como undefined y 
        luego el ?? devuelve false si es undefined y si es cualquier otra cosa devuelve el this.explored[row]?.[col] */
        return this.explored[row]?.[col] ?? false;
    }

    public isVisible(col: number, row: number, playerCol: number, playerRow: number): boolean {
        const distanceFromPlayerX = col - playerCol;
        const distanceFromPlayerY = row - playerRow;
        return distanceFromPlayerX * distanceFromPlayerX + distanceFromPlayerY * distanceFromPlayerY <= this.radius * this.radius;
    }

    public restartFog() {
        this.explored = [];
        this.initializeFogMatrix(this.height, this.width);
    }
}