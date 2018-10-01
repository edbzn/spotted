export interface ILocation {
  id: string;
  distance: number;

  setDistance(distance: number): ILocation;
}
