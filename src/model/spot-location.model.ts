export class SpotLocation {
  constructor(public id: string, public distance: number) {}

  public setDistance(distance: number): SpotLocation {
    this.distance = distance;
    return this;
  }
}
