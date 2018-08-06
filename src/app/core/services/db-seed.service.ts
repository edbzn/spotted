import { GeoService } from './geo.service';
import { Api } from 'src/types/api';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DbSeed {
  constructor(private geo: GeoService) {}

  public seed(spots: Api.Spot[] = []): void {
    const dummySpots = spots.map(spot => ({
      id: spot.id,
      location: [spot.location.latitude, spot.location.longitude],
    }));

    dummySpots.forEach(spot => {
      this.geo.setLocation(name, [...spot.location]);
    });
  }
}
