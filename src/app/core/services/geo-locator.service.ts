import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { GeoFirestore, GeoFirestoreQuery, QueryCriteria } from 'geofirestore';

@Injectable({ providedIn: 'root' })
export class GeoLocatorService {
  /**
   * The running query
   */
  public geoQuery: GeoFirestoreQuery | null = null;

  /**
   * Collection store ref
   */
  private geoStore: GeoFirestore;

  constructor() {
    const collectionRef = firebase.firestore().collection('spotLocation');
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
  ): GeoFirestoreQuery {
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

    return this.geoQuery;
  }

  /**
   * Delete spot location
   */
  public delete(ref: string): Promise<void> {
    return this.geoStore.remove(ref);
  }
}
