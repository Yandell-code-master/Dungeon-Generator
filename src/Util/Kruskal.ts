class Kruskal {
    public static getMSTWithKruskal(points: number[][], edgesWithWeight: number[][]):  {

        edgesWithWeight.sort((a, b) => a.peso - b.peso);

        const mst = [];
        for (const { u, v, peso } of aristasConPeso) {
            if (uf.union(u, v)) { 
                mst.push({ u, v, peso });
            }
        }

        return mst;
    }
}