import { Injectable } from '@angular/core';
import { GeoLocator } from './geo-locator.service';
import { SpotsService } from './spots.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Api } from 'src/types/api';
import { GeoCallbackRegistration } from 'geofirestore';
import { MatSnackBar } from '@angular/material';
import { distinctUntilChanged } from 'rxjs/operators';
import { isEqual } from 'src/utils/functions/deep-compare';

@Injectable({ providedIn: 'root' })
export class SpotLocatorService extends GeoLocator {
  /**
   * Spot moved event registration
   */
  private movedRegistration: GeoCallbackRegistration | null = null;

  /**
   * Spot entered event registration
   */
  private enteredRegistration: GeoCallbackRegistration | null = null;

  /**
   * Internal spot collection
   */
  private _spots = new BehaviorSubject<Api.Spot[]>([]);

  /**
   * Exposed spot collection
   */
  public spots: Observable<Api.Spot[]> = this._spots.asObservable();

  constructor(private spotsService: SpotsService, private snack: MatSnackBar) {
    super('spotLocation');
  }

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
  ): Observable<Api.Spot[]> {
    if (this.movedRegistration !== null) {
      this.movedRegistration.cancel();
    }
    if (this.enteredRegistration !== null) {
      this.enteredRegistration.cancel();
    }

    const geoQuery = this.query(location, radius, query);

    this.enteredRegistration = geoQuery.on(
      'key_entered',
      this.updateSpotsCollection
    );

    this.movedRegistration = geoQuery.on(
      'key_moved',
      this.updateSpotsCollection
    );

    return this.spots.pipe(
      distinctUntilChanged(
        (prevSpotsCollection: Api.Spot[], nextSpotsCollection: Api.Spot[]) =>
          isEqual(prevSpotsCollection, nextSpotsCollection)
      )
    );
  }

  /**
   * Update spot collection
   */
  private updateSpotsCollection = async (key: string): Promise<void> => {
    const doc = await this.spotsService.get(key);
    const spot = doc.data() as Api.Spot;
    const spots = this._spots.value;
    const isNew = spots.findIndex(_spot => _spot.id === key) === -1;
    const hasChanged = spots.some(_spot => spot.id === key && spot === _spot);

    if (!isNew && hasChanged) {
      this.update(spot, spots);

      // @todo add locate action
      // @todo translation
      this.snack.open(`A spot was updated near you're looking!`, 'ok', {
        duration: 10000, // 10s
      });
    } else if (isNew) {
      this.add(spot);

      // @todo add locate action
      // @todo translation
      this.snack.open(`A spot found near you're looking!`, 'ok', {
        duration: 10000, // 10s
      });
    }
    // tslint:disable-next-line:semicolon
  };

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
