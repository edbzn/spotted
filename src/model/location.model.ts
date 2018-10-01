import { ILocation } from './location';

export class Location implements ILocation {
  constructor(public id: string, public distance: number) {}

  public setDistance(distance: number): ILocation {
    this.distance = distance;
    return this;
  }
}
