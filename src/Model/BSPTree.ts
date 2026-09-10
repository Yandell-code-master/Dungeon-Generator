import { BSPNode } from "./BSPNode";

export class BSPTree {
    private root: BSPNode;
    private pieceMinSize: number; // Se refiere a celdas de 32 pixeles

    constructor() {
        this.root = new BSPNode(0, 0, 38, 25); // Se crea por predetermiado
        this.pieceMinSize = 6; // 6 Celdas y cada celda es 32 bits
    }

    /* 
    Es el método que comienza toda la construcción del arbol con el nivel raiz
    */

    public startTreeCreation(): void {
        this.splitTreeLevel(this.root);
    }

    /* 
    Este es el método que será encargado de dividir cada nivel del arbol de forma recursiva
    */

    private splitTreeLevel(node: BSPNode): void {

        const didSplit = this.splitNode(node);

        // Si el corte fue exitoso, dividimos recursivamente a sus dos hijos
        const leftChild = node.getLeftChild();
        const rightChild = node.getRightChild();

        // nos aseguramos que ninguno de sus hijos sea undefined
        if (didSplit && leftChild && rightChild) {
            this.splitTreeLevel(leftChild);
            this.splitTreeLevel(rightChild);
        }
    }

    // Método encargado de dividir un nodo especifico.
    private splitNode(node: BSPNode): boolean {
        if (node.getLeftChild() || node.getRightChild()) return false; // Ya está dividido


        /*
        Primero se determina hacia donde irá el corte (vertical u horizontal). Esto se hace primeramente de froma aleatoria, pero luego se determina
        si el nodo es demasiado ancho o demasiado alto, en cuyo caso se fuerza el corte a ser vertical u horizontal respectivamente.
        */
        let isSplitHorizontal = Math.random() >= 0.5;
        if (node.getWidth() / node.getHeight() >= 1.25) isSplitHorizontal = false; // Forzar corte vertical
        else if (node.getHeight() / node.getWidth() >= 1.25) isSplitHorizontal = true; // Forzar corte horizontal

        /*
        Luego tiene que determinar en que parte del nodo se hará el corte, esto teniendo en cuenta que donde se haga el corte ambos nodos resultantes
        deben ser como mínimo del tamaño 'minSize', de lo contrario no se hace el corte y se retorna false.
        
        Por lo que se puede ver que primero se le resta minSize al ancho o alto del nodo (dependiendo de si el corte es vertical u horizontal) y eso nos da el valor
        maximo puede tener el cortes, por lo que ya tenemos un rango de valores posibles para el corte, en el que ambos nodos cumplen con el tamaño minimo.

        Imagimemos los siguientes valores:
        Nodo: 100x50
        minSize: 20
        

        Como vemos el nodo es mucho mas ancho que alto, por lo que el corte se hará verticalmente

        por lo que max es igual a 100 - 20 = 80

        con esto podemos ver que si hicieramos el corte en la posición max la cual es 80, el nodo izquierdo tendría un ancho de 80 y el nodo derecho tendría un ancho de 20
        por lo que ambos nodos cumples con el tamaño minimo.
        */
        const max = (isSplitHorizontal ? node.getHeight() : node.getWidth()) - this.pieceMinSize;
        if (max <= this.pieceMinSize) return false; // Demasiado pequeño para dividir

        /*
        Esta es la formula estandar para obtener un numero aleatorio entre dos valores, en este caso el rango está definido por max y minSize
        */
        const splitPosition = Math.floor(Math.random() * (max - this.pieceMinSize + 1)) + this.pieceMinSize;

        // Finalmente se crean los nodos hijos, dependiendo de si el corte es horizontal o vertical.
        if (isSplitHorizontal) { // Corte Horizontal
            /*
            Imaginemos que el corte es horizontal, por lo que el nodo de la izquierda tiene la misma posicion de su padre y su mismo ancho, pero su altura es la posicion
            en donde se hace el corte.

            Por otro lado el nodo de la derecha tiene la misma posicion en x pero en y su posicion es la posicion del padre más el lugar en donde se hace el corte, su ancho
            es el mismo del de su padre pero su altura es la altura del padre menos la posicion en donde se hace el corte.
            */

            node.setLeftChild(new BSPNode(node.getPositionInX(), node.getPositionInY(), node.getWidth(), splitPosition));
            node.setRightChild(new BSPNode(node.getPositionInX(), node.getPositionInY() + splitPosition, node.getWidth(), node.getHeight() - splitPosition));
        } else { // Corte Vertical
            node.setLeftChild(new BSPNode(node.getPositionInX(), node.getPositionInY(), splitPosition, node.getHeight()));
            node.setRightChild(new BSPNode(node.getPositionInX() + splitPosition, node.getPositionInY(), node.getWidth() - splitPosition, node.getHeight()));
        }

        return true;
    }

    public printTree(node: BSPNode = this.root, indent: string = "", isLeft: boolean = true): void {
        const isLeaf = !node.getLeftChild() && !node.getRightChild(); // Revisa si es que los hijos son nulos y si lo son significa que el nodo es una hoja
        const typeNodeLabel = isLeaf ? "[HOJA]" : "[NODO]";

        console.log(
            `${indent}${isLeft ? "├──" : "└──"}${typeNodeLabel} ` +
            `Pos: (${node.getPositionInX()}, ${node.getPositionInY()}) | Tam: ${node.getWidth()}x${node.getHeight()}`
        );

        const newIndent = indent + (isLeft ? "│   " : "    ");

        const leftChild = node.getLeftChild();
        const rightChild = node.getRightChild();
        if (leftChild) {
            this.printTree(leftChild, newIndent, true);
        }
        if (rightChild) {
            this.printTree(rightChild, newIndent, false);
        }
    }

    public getLeaves(node: BSPNode = this.root): BSPNode[] {

        // Si no tiene hijos significa que es una por lo que se devuelve para sumarse dentro del array que luego se retornará
        if (!node.getLeftChild() && !node.getRightChild()) {
            return [node];
        }
        
        // Hace la busqueda recursiva por cada rama que tenga el arbol para meter las hojas en la lista y luego devolver la misma
        const leaves: BSPNode[] = [];
        const leftChild = node.getLeftChild();
        const rightChild = node.getRightChild();
        if (leftChild) leaves.push(...this.getLeaves(leftChild));
        if (rightChild) leaves.push(...this.getLeaves(rightChild));

        return leaves;
    }
}

