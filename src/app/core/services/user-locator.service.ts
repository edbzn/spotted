import { Injectable } from '@angular/core';

import { AuthService } from '../../authentication/auth.service';
import { GeoLocator } from './geo-locator';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { Rider } from '../../../model/rider.model';

@Injectable({ providedIn: 'root' })
export class UserLocatorService extends GeoLocator {
  constructor(private auth: AuthService) {
    super('riderLocation');
  }

  setRiderLocation(latLng: {
    latitude: number;
    longitude: number;
  }): Promise<void> {
    const { user } = this.auth;

    if (!user) {
      throw new Error('User must be logged in');
    }

    const { uid, displayName } = user;

    return this.set(uid, latLng, new Rider(uid, displayName));
  }
}
