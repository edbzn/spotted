import { Injectable } from '@angular/core';

import { GeoLocator } from './geo-locator';

@Injectable({ providedIn: 'root' })
export class SpotLocatorService extends GeoLocator {
  constructor() {
    super('spotLocation');
  }
}
