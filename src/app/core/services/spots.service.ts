import { GeoLocatorService } from './geo-locator.service';
import { Api } from '../../../types/api';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { tap, delay } from 'rxjs/internal/operators';
import { ProgressBarService } from './progress-bar.service';
import { User } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({ providedIn: 'root' })
export class SpotsService {
  private spotsPath = 'spots';

  /**
   * Firebase collection
   */
  private spotsCollection: AngularFirestoreCollection<Api.Spot>;

  constructor(
    private readonly db: AngularFirestore,
    private progressBar: ProgressBarService,
    private auth: AngularFireAuth,
    private geoLocator: GeoLocatorService
  ) {
    this.spotsCollection = this.db.collection<Api.Spot>(this.spotsPath);
    this.spotsCollection
      .stateChanges()
      .pipe(
        tap(() => this.progressBar.increase()),
        delay(Math.floor(Math.random() * (1000 - 200 + 1) + 200)), // random between 200ms and 1000ms
        tap(() => this.progressBar.decrease())
      )
      .subscribe();
  }

  /**
   * Get a spot
   */
  public async get(id: string) {
    return this.spotsCollection.doc<Api.Spot>(id).ref.get();
  }

  /**
   * Add a Spot
   */
  public add(spot: Api.Spot): Promise<void> {
    const id = this.db.createId();

    return new Promise<void>((resolve, reject) => {
      this.db
        .doc(this.spotsPath + '/' + id)
        .set({ ...spot, id })
        .then(() => {
          return this.geoLocator.set(id, spot.location);
        })
        .then(() => resolve())
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Update a Spot
   */
  public async update(ref: string, spot: Api.Spot): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.spotsCollection
        .doc(ref)
        .update(spot)
        .then(() => {
          return this.geoLocator.set(spot.id, spot.location);
        })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }

  /**
   * Delete a Spot
   */
  public delete(ref: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.spotsCollection
        .doc(ref)
        .delete()
        .then(() => {
          return this.geoLocator.delete(ref);
        })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }

  /**
   * Like a spot
   */
  public like(spot: Api.Spot): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.auth.user.subscribe(
        user => {
          if (!this.likable(spot, user)) {
            return;
          }

          const { likes } = spot;
          ++likes.count;
          likes.byUsers.push(user.uid.toString());

          const likedSpot: Api.Spot = {
            ...spot,
            likes,
          };

          this.update(spot.id, likedSpot)
            .then(() => resolve())
            .catch(err => reject(err));
        },
        err => reject(err)
      );
    });
  }

  /**
   * Check if spot is likable
   */
  public likable(spot: Api.Spot, user: User): boolean {
    if (null === user) {
      return false;
    }
    const { byUsers } = spot.likes;

    return !byUsers.includes(user.uid.toString());
  }
}
