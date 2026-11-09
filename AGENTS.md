# AGENTS.md

Browser-only Vite + TypeScript dungeon crawler. No backend, framework, tests, linter, formatter, CI, or README. Use npm (`package-lock.json` is the only lockfile).

## Commands

- `npm run dev` — start Vite. Open the printed URL, click **Generar Mapa**, then move with WASD/arrows. Input is ignored until a dungeon exists and the sprite sheet finishes loading.
- `npm run examine` — typecheck only (`tsc`). This is the repo's only verification step.
- `npm run build` — `tsc && vite build`; fails whenever `examine` fails.
- `npm run preview` — serve the built `dist/`.
- There is no single-test command; verify changes manually in the browser.
- `npm run examine` is currently red on `noUnusedLocals`/`noUnusedParameters` errors (e.g. unused `Enemy.tryMoveBy`, unused imports in `DungeonDrawer`). Treat these as pre-existing so you don't mistake them for regressions; `build` stays red until they are cleaned up.

## Architecture

- Entry is `index.html` → `/src/Initializator.ts` (not `main.ts`). It creates one `GameManager` and wires the generate button and keyboard.
- `GameManager` orchestrates `DungeonCreator` (generation) → `DungeonDrawer` (render via `Camara`) and `FogOfWar` (exploration/visibility).
- Generation: BSP splits the map into leaves (`BSPTree`/`BSPNode`) → one `Room` per leaf → Delaunator triangulates room centers → `Kruskal`/`UnionFind` selects mandatory connections → L-shaped `Corridor`s are carved into `Dungeon.matrixTiles` as `FloorTile`/`WallTile`.
- `Dungeon.matrixTiles` is indexed `[y][x]`. Room 0's center is the player spawn; the farthest room receives the `StairTile` whose `onEnter` advances the level.
- Tile hierarchy: `Tile` → `WalkableTile` / `NoneWalkableTile`; walkable tiles implement `onEnter(GameManager)`. New interactive tiles should extend `WalkableTile` and keep that hook.
- `Dungeon` owns the matrix, player, enemies, and fog. `DungeonCreator.createDungeon()` reuses and mutates the same `Dungeon` instance. On later levels the BSP leaves are already split and `Dungeon.enemies` is appended to, not cleared; reset state explicitly if you change level flow.

## Rendering and coordinates

- World positions are 32px cells. The sprite sheet `public/assets/tilemap_packed.png` uses 16px tiles and is scaled 2× at draw time. `SpriteRef {col,row}` indexes the sheet, not pixels.
- The camera view is 25×15 cells and is tied to the hardcoded 800×480 canvas in `index.html`; change them together.
- The player is drawn over the matrix and is not stored in it. Enemies live in `Dungeon.enemies` and are drawn over their tile when visible.
- Fog remembers explored cells and recomputes current visibility from the player on every redraw.

## TypeScript constraints

- `erasableSyntaxOnly: true`: no `enum`, `namespace`, or constructor parameter properties (`constructor(private x: ...)`). The repo deliberately uses const objects/union types instead.
- `verbatimModuleSyntax: true`: use `import type` for type-only imports.
- `noUnusedLocals` and `noUnusedParameters` are enabled; unused imports/params fail `tsc`.
- `moduleResolution: "bundler"` with `noEmit`; extensionless imports are the norm (the lone `../Model/Room.ts` import is also valid).
- `tsconfig.json` includes a nonexistent `src/TileTypeEnum.ts`. It is harmless; don't recreate it by accident.

## Conventions and noise

- Comments, error messages, UI text, and commit history are in Spanish; keep new comments and commit messages in Spanish.
- `NOTAS.txt` is personal study notes, not project documentation. The root file named `git` is an accidental ANSI `git log` dump, not a script.
- `delaunator` is imported at runtime but declared under `devDependencies`; don't remove it as "dev-only".
