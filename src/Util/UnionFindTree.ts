/*Esta clase representa un tipo de padre que se utiliza para representar un grupo de nodos que todos apuntan hacia su padre, esto difiere 
con como son los arboles normalmente que apuntan a sus hijos*/

class UnionFindTree {
    private padre: number[];
    private rango: number[];

    constructor(n: number) {
        this.padre = Array.from({ length: n }, (_, i) => i);
        this.rango = new Array(n).fill(0);
    }

    find(x: number): number {
        if (this.padre[x] !== x) {
            this.padre[x] = this.find(this.padre[x]);
        }
        return this.padre[x];
    }

    union(x: number, y: number): boolean {
        const raizX = this.find(x);
        const raizY = this.find(y);

        if (raizX === raizY) {
            return false;
        }

        if (this.rango[raizX] < this.rango[raizY]) {
            this.padre[raizX] = raizY;
        } else if (this.rango[raizX] > this.rango[raizY]) {
            this.padre[raizY] = raizX;
        } else {
            this.padre[raizY] = raizX;
            this.rango[raizX]++;
        }

        return true;
    }

    conectados(x: number, y: number): boolean {
        return this.find(x) === this.find(y);
    }
}

const uf = new UnionFind(5);

console.log(uf.union(0, 1));
console.log(uf.union(2, 3));
console.log(uf.union(1, 2));
console.log(uf.union(0, 2));
console.log(uf.union(3, 4));

console.log(uf.conectados(0, 4));