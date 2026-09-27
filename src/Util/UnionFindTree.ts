/*Esta clase representa un tipo de padre que se utiliza para representar un grupo de nodos que todos apuntan hacia su padre, esto difiere 
con como son los arboles normalmente que apuntan a sus hijos*/

class UnionFindTree {
    private father: number[];
    private range: number[];

    constructor(amountNodes: number) {
        this.father = Array.from({ length: amountNodes }, (_, i) => i);
        this.range = new Array(amountNodes).fill(0);
    }

    // Este metodo encuentra la raiz del arbol
    public find(index: number): number {

        // Si el indice del padre no es el mismo al indice pasado significa que no es a raiz y se llama recursivamente
        if (this.father[index] !== index) {
            this.father[index] = this.find(this.father[index]);
        }

        return this.father[index];
    }

    // Une los grupos si es que los nodos estan en diferente grupos
    public union(firstNodeIndex: number, secondNodeIndex: number): boolean {
        const firstNodeRootIndex = this.find(firstNodeIndex);
        const secondNodeRootIndex = this.find(secondNodeIndex);

        if (firstNodeRootIndex === secondNOdeRootIndex) {
            return false;
        }

        if (this.range[firstNodeRootIndex] < this.range[secondNodeRootIndex]) {
            this.father[firstNodeRootIndex] = secondNodeRootIndex;
        } else if (this.range[firstNodeRootIndex] > this.range[secondNodeRootIndex]) {
            this.father[firstNodeRootIndex] = secondNodeRootIndex;
        } else {
            this.father[secondNodeRootIndex] = firstNodeRootIndex;
            this.range[firstNodeRootIndex]++;
        }

        return true;
    }

    public areConnected (x: number, y: number): boolean {
        return this.find(x) === this.find(y);
    }
}
