import { Injectable } from '@angular/core';
import { GeoLocator } from './geo-locator.service';
import { AuthService } from '../../authentication/auth.service';

@Injectable({ providedIn: 'root' })
export class UserLocatorService extends GeoLocator {
  constructor(private auth: AuthService) {
    super('userLocation');
  }
}
