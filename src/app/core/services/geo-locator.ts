import * as firebase from 'firebase/app';
import {
  GeoCallbackRegistration,
  GeoFirestore,
  GeoFirestoreQuery,
  QueryCriteria,
} from 'geofirestore';
import { BehaviorSubject, Observable } from 'rxjs';

import { Location } from '../../../model/location.model';
import { ILocation } from '../../../model/location';

const enum GeofireEvents {
  onEnter = 'key_entered',
  onMove = 'key_moved',
  onExit = 'key_exited',
}

export abstract class GeoLocator {
  /**
   * The running query
   */
  public geoQuery: GeoFirestoreQuery | null = null;

  /**
   * Collection store ref
   */
  protected geoStore: GeoFirestore;

  /**
   * Entity moved event registration
   */
  protected movedRegistration: GeoCallbackRegistration | null = null;

  /**
   * Entity entered event registration
   */
  protected enteredRegistration: GeoCallbackRegistration | null = null;

  /**
   * Entity exited event registration
   */
  protected exitedRegistration: GeoCallbackRegistration | null = null;

  /**
   * Internal locations
   */
  private _locations = new BehaviorSubject<ILocation[]>([]);

  /**
   * Exposed locations
   */
  public locations: Observable<ILocation[]> = this._locations.asObservable();

  /**
   * Create the geo store & the firebase collection end point
   */
  constructor(endPoint: string) {
    const collectionRef = firebase.firestore().collection(endPoint);
    this.geoStore = new GeoFirestore(collectionRef);
  }

  /**
   * Add or update spot location
   */
  public set(
    key: string,
    location: { latitude: number; longitude: number }
  ): Promise<void> {
    return this.geoStore.set(key, {
      coordinates: new firebase.firestore.GeoPoint(
        location.latitude,
        location.longitude
      ),
    });
  }

  /**
   * Query spot locations matching the given geo query
   */
  public query(
    location: { latitude: number; longitude: number },
    radius,
    query?: (
      ref: firebase.firestore.CollectionReference
    ) => firebase.firestore.Query
  ): Observable<ILocation[]> {
    this.clearRegistrations();

    const geoQueryParams: QueryCriteria = {
      center: new firebase.firestore.GeoPoint(
        location.latitude,
        location.longitude
      ),
      radius,
    };

    if (query) {
      geoQueryParams.query = query;
    }

    if (this.geoQuery !== null) {
      this.geoQuery.updateCriteria(geoQueryParams);
    } else {
      this.geoQuery = this.geoStore.query(geoQueryParams);
    }

    this.setupRegistrations();

    return this.locations;
  }

  /**
   * Delete spot location
   */
  public delete(ref: string): Promise<void> {
    return this.geoStore.remove(ref);
  }

  /**
   * Setup event listeners
   */
  protected setupRegistrations(): void {
    this.enteredRegistration = this.geoQuery.on(
      GeofireEvents.onEnter,
      this.onLocationEnter.bind(this)
    );
    this.movedRegistration = this.geoQuery.on(
      GeofireEvents.onMove,
      this.onLocationMove.bind(this)
    );
    this.movedRegistration = this.geoQuery.on(
      GeofireEvents.onExit,
      this.onLocationExit.bind(this)
    );
  }

  /**
   * Cancel event listeners
   */
  protected clearRegistrations(): void {
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
   * Add an entry in exposed locations
   */
  protected onLocationEnter(key: string, _doc: any, distance: number): void {
    const location = this.create(key, distance);
    const commit: ILocation[] = [location, ...this._locations.value];

    this._locations.next(commit);
  }

  /**
   * Modify an entry in exposed locations
   */
  protected onLocationMove(key: string, _doc: any, distance: number): void {
    const commit: ILocation[] = this._locations.value.map(location => {
      if (location.id === key) {
        return location.setDistance(distance);
      }

      return location;
    });

    this._locations.next(commit);
  }

  /**
   * Remove an entry in exposed locations
   */
  protected onLocationExit(key: string, _doc: any, _distance: number): void {
    const commit: ILocation[] = this._locations.value.filter(
      location => location.id !== key
    );

    this._locations.next(commit);
  }

  /**
   * Create the location
   */
  protected create(key: string, distance: number): ILocation {
    return new Location(key, distance);
  }
}
