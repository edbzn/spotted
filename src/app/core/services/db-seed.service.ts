import { Api } from 'src/types/api';
import { Injectable } from '@angular/core';
import { SpotsService } from './spots.service';

@Injectable({ providedIn: 'root' })
export class DbSeed {
  constructor(private spots: SpotsService) {}

  public seed(): void {
    import('../../../fixtures').then(module => {
      module.spots.forEach(spot => {
        this.spots.add(spot as Api.Spot);
      });
    });
  }
}
