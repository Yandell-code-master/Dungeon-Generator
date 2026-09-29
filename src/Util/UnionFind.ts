/*Esta clase representa un tipo de padre que se utiliza para representar un grupo de nodos que todos apuntan hacia su padre, esto difiere 
con como son los arboles normalmente que apuntan a sus hijos*/

class UnionFind {
    private father: number[];
    private range: number[];

    // Se le pasa el numero de nodos que tendrá la estructura
    constructor(amountNodes: number) {
        // Crea una lista con la cantidad de nodos y se le asigna a cada posicion su indice, ya que al principio cada nodo es su propio padre por eso si quiero el padre del nodo con el indice 0 me tiene que devolver 0 
        this.father = Array.from({ length: amountNodes }, (_, i) => i);
        // Crea una lista con el range para cada grupo, el range es la altura que podría tener el arbol
        this.range = new Array(amountNodes).fill(0);
    }

    // Este metodo encuentra la raiz del arbol
    private find(index: number): number {

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

        // Si tienen el mismo padre no se hace nada ya que ya estan en el mismo grupo
        if (firstNodeRootIndex === secondNodeRootIndex) {
            return false;
        }

        /* Esto decide si cual arbol se debe de colgar de la raíz del otro, en este caso como queremos que el arbol tenga la menos longitud posible
        para que de esa forma find() sea más rápido entonces lo que se hace es colgar los arboles más pequeños en altura que los mas grandes
        en altura */
        if (this.range[firstNodeRootIndex] < this.range[secondNodeRootIndex]) {
            this.father[firstNodeRootIndex] = secondNodeRootIndex;
        } else if (this.range[firstNodeRootIndex] > this.range[secondNodeRootIndex]) {
            this.father[secondNodeRootIndex] = firstNodeRootIndex;
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
