import { Injectable } from '@angular/core';
import { GeoCallbackRegistration, GeoFirestoreQuery } from 'geofirestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpotLocation } from '../../../model/spot-location.model';

import { GeoLocator } from './geo-locator.service';

const enum GeofireEvents {
  onEnter = 'key_entered',
  onMove = 'key_moved',
  onExit = 'key_exited',
}

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
   * Spot exited event registration
   */
  private exitedRegistration: GeoCallbackRegistration | null = null;

  /**
   * Internal spot locations
   */
  private _spotLocations = new BehaviorSubject<SpotLocation[]>([]);

  /**
   * Exposed spot locations
   */
  public spotLocations: Observable<
    SpotLocation[]
  > = this._spotLocations.asObservable();

  constructor() {
    super('spotLocation');
  }

  /**
   * Get spots ids around given location
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
  ): Observable<SpotLocation[]> {
    this.clearRegistrations();

    const geoQuery = this.query(location, radius, query);

    this.setupRegistrations(geoQuery);

    return this.spotLocations;
  }

  /**
   * Setup event listeners
   */
  private setupRegistrations(geoQuery: GeoFirestoreQuery): void {
    this.enteredRegistration = geoQuery.on(
      GeofireEvents.onEnter,
      this.onLocationEnter.bind(this)
    );
    this.movedRegistration = geoQuery.on(
      GeofireEvents.onMove,
      this.onLocationMove.bind(this)
    );
    this.movedRegistration = geoQuery.on(
      GeofireEvents.onExit,
      this.onLocationExit.bind(this)
    );
  }

  /**
   * Cancel event listeners
   */
  private clearRegistrations(): void {
    if (this.movedRegistration !== null) {
      this.movedRegistration.cancel();
    }
    if (this.enteredRegistration !== null) {
      this.enteredRegistration.cancel();
    }
    if (this.exitedRegistration !== null) {
      this.exitedRegistration.cancel();
    }
  }

  /**
   * Add an entry in exposed spotLocations
   */
  private onLocationEnter(key: string, _doc: any, distance: number): void {
    const location = new SpotLocation(key, distance);
    const commit: SpotLocation[] = [location, ...this._spotLocations.value];

    this._spotLocations.next(commit);
  }

  /**
   * Modify an entry in exposed spotLocations
   */
  private onLocationMove(key: string, _doc: any, distance: number): void {
    const commit: SpotLocation[] = this._spotLocations.value.map(
      spotLocation => {
        if (spotLocation.id === key) {
          return spotLocation.setDistance(distance);
        }

        return spotLocation;
      }
    );

    this._spotLocations.next(commit);
  }

  /**
   * Remove an entry in exposed spotLocations
   */
  private onLocationExit(key: string, _doc: any, _distance: number): void {
    const commit: SpotLocation[] = this._spotLocations.value.filter(
      spotLocation => spotLocation.id !== key
    );

    this._spotLocations.next(commit);
  }
}
