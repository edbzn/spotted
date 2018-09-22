import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { GeoFirestore, GeoFirestoreQuery, QueryCriteria } from 'geofirestore';
import { Api } from 'src/types/api';

@Injectable({ providedIn: 'root' })
export class GeoLocatorService {
  private geoStore: GeoFirestore;

  constructor() {
    const collectionRef = firebase.firestore().collection('spotLocation');
    this.geoStore = new GeoFirestore(collectionRef);
  }

  public add(spot: Api.Spot): Promise<void> {
    return this.geoStore.set(spot.id, {
      coordinates: new firebase.firestore.GeoPoint(
        spot.location.latitude,
        spot.location.longitude
      ),
    });
  }

  public query(
    spot: Api.Spot,
    radius: number = 10,
    query?: (
      ref: firebase.firestore.CollectionReference
    ) => firebase.firestore.Query
  ): GeoFirestoreQuery {
    const geoQuery: QueryCriteria = {
      center: new firebase.firestore.GeoPoint(
        spot.location.latitude,
        spot.location.longitude
      ),
      radius,
    };

    if (query) {
      geoQuery.query = query;
    }

    return this.geoStore.query(geoQuery);
  }
}
