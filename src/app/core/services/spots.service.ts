import { AuthService } from './../../authentication/auth.service';
import { Api } from '../../../types/api';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { tap, delay } from 'rxjs/internal/operators';
import { ProgressBarService } from './progress-bar.service';
import { SpotLocatorService } from './spot-locator.service';

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
    private auth: AuthService,
    private spotLocator: SpotLocatorService
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
  public get(id: string): Promise<firebase.firestore.DocumentSnapshot> {
    return this.spotsCollection.doc<Api.Spot>(id).ref.get();
  }

  /**
   * Add a Spot
   */
  public add(spot: Api.Spot): Promise<void> {
    const id = this.db.createId();

    return this.db
      .doc(this.spotsPath + '/' + id)
      .set({ ...spot, id })
      .then(() => {
        return this.spotLocator.set(id, spot.location);
      });
  }

  /**
   * Update a Spot
   */
  public update(ref: string, spot: Api.Spot): Promise<void> {
    return this.spotsCollection
      .doc(ref)
      .update(spot)
      .then(() => {
        return this.spotLocator.set(spot.id, spot.location);
      });
  }

  /**
   * Delete a Spot
   */
  public delete(ref: string): Promise<void> {
    return this.spotsCollection
      .doc(ref)
      .delete()
      .then(() => {
        return this.spotLocator.delete(ref);
      });
  }

  /**
   * Like a spot
   */
  public like(spot: Api.Spot): Promise<void> {
    if (!this.auth.authenticated) {
      return;
    }
    const { user } = this.auth;
    if (!this.likable(spot)) {
      return;
    }

    const { likes } = spot;
    ++likes.count;
    likes.byUsers.push(user.uid.toString());

    const likedSpot: Api.Spot = {
      ...spot,
      likes,
    };

    return this.update(spot.id, likedSpot);
  }

  /**
   * Check if spot is likable
   */
  public likable(spot: Api.Spot): boolean {
    if (!this.auth.authenticated) {
      return false;
    }

    const { user } = this.auth;
    const { byUsers } = spot.likes;

    return !byUsers.includes(user.uid.toString());
  }
}
