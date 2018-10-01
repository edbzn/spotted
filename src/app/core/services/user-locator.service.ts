import { Injectable } from '@angular/core';

import { AuthService } from '../../authentication/auth.service';
import { GeoLocator } from './geo-locator';

@Injectable({ providedIn: 'root' })
export class UserLocatorService extends GeoLocator {
  constructor(private auth: AuthService) {
    super('userLocation');
  }
}
