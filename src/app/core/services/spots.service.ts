import { Api } from '../../../types/api';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { tap, delay, map } from 'rxjs/internal/operators';
import { ProgressBarService } from './progress-bar.service';
import { User } from 'firebase';

@Injectable({ providedIn: 'root' })
export class SpotsService {
  /**
   * Firebase collection
   */
  private spotsCollection: AngularFirestoreCollection<Api.Spot>;

  /**
   * Exposed Spots
   */
  public spots: Observable<Api.Spot[]>;

  constructor(
    readonly db: AngularFirestore,
    private progressBar: ProgressBarService
  ) {
    this.spotsCollection = db.collection<Api.Spot>('spots');
    this.spots = this.spotsCollection.snapshotChanges().pipe(
      map(spots =>
        spots.map(spot => ({
          ...spot.payload.doc.data(),
          id: spot.payload.doc.id,
        }))
      )
    );

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
   * Get a document
   */
  public async get(id: string) {
    return this.spotsCollection.doc(id).ref.get();
  }

  /**
   * Add a Spot
   */
  public async add(spot: Api.Spot) {
    return this.spotsCollection.add({ ...spot });
  }

  /**
   * Update a Spot
   */
  public async update(ref: string, spot: Api.Spot) {
    return this.spotsCollection.doc(ref).update(spot);
  }

  /**
   * Delete a Spot
   */
  public async delete(ref: string) {
    return this.spotsCollection.doc(ref).delete();
  }

  /**
   * Like a spot
   */
  public async like(ref: string, spot: Api.Spot, user: User) {
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

    return this.update(ref, likedSpot);
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
