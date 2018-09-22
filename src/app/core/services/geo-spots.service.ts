import { Injectable } from '@angular/core';
import { GeoLocatorService } from './geo-locator.service';
import { SpotsService } from './spots.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Api } from 'src/types/api';
import { GeoCallbackRegistration } from 'geofirestore';

@Injectable({ providedIn: 'root' })
export class GeoSpotsService {
  private movedRegistration: GeoCallbackRegistration | null = null;

  private enteredRegistration: GeoCallbackRegistration | null = null;

  /**
   * Internal spot collection
   */
  private _spots = new BehaviorSubject<Api.Spot[]>([]);

  /**
   * Exposed spot collection
   */
  public spots: Observable<Api.Spot[]> = this._spots.asObservable();

  constructor(
    private spotsService: SpotsService,
    private geoLocator: GeoLocatorService
  ) {}

  /**
   * Get spots around given location
   */
  public getSpotsByLocation(
    location: {
      latitude: number;
      longitude: number;
    },
    radius: number = 50,
    query?: (
      ref: firebase.firestore.CollectionReference
    ) => firebase.firestore.Query
  ) {
    if (this.movedRegistration !== null) {
      this.movedRegistration.cancel();
    }
    if (this.enteredRegistration !== null) {
      this.enteredRegistration.cancel();
    }

    const geoQuery = this.geoLocator.query(location, radius, query);

    this.enteredRegistration = geoQuery.on(
      'key_entered',
      this.updateCollection.bind(this)
    );

    this.movedRegistration = geoQuery.on(
      'key_moved',
      this.updateCollection.bind(this)
    );

    return this.spots;
  }

  /**
   * Update spot collection
   */
  private async updateCollection(key: string): Promise<void> {
    const doc = await this.spotsService.get(key);
    const spot = doc.data() as Api.Spot;
    const spots = this._spots.value;

    if (spots.findIndex(s => s.id === key) > -1) {
      this.update(spot, spots);
    } else {
      this.add(spot);
    }
  }

  /**
   * Add a spot to the collection
   */
  private add(spot: Api.Spot): void {
    this._spots.next([...this._spots.value, spot]);
  }

  /**
   * Update the given spot in collection
   */
  private update(spotToCommit: Api.Spot, spots: Api.Spot[]): void {
    const commit = spots.map(spot => {
      if (spotToCommit.id === spot.id) {
        return spotToCommit;
      }

      return spot;
    });

    this._spots.next(commit);
  }
}
