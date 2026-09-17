
export class Point {
  private positionInX: number; // Coordenada X en celdas
  private positionInY: number; // Coordenada Y en celdas

  constructor(positionInX: number, positionInY: number) {
    this.positionInX = positionInX;
    this.positionInY = positionInY;
  }

  public getPositionInX(): number {
    return this.positionInX;
  }

  public setPositionInX(positionInX: number) {
    this.positionInX = positionInX;
  }

  public getPositionInY(): number {
    return this.positionInY;
  }

  public setPositionInY(positionInY: number) {
    this.positionInY = positionInY;
  }
} 