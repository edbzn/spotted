export interface ILocation {
  id: string;
  distance: number;

  setDistance(distance: number): ILocation;
}

export class Location implements ILocation {
  constructor(public id: string, public distance: number) {}

  public setDistance(distance: number): ILocation {
    this.distance = distance;
    return this;
  }
}
