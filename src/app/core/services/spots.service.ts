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
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({ providedIn: 'root' })
export class SpotsService {
  private spotsPath = 'spots';

  /**
   * Firebase collection
   */
  private spotsCollection: AngularFirestoreCollection<Api.Spot>;

  /**
   * Exposed Spots
   */
  public spots: Observable<Api.Spot[]>;

  constructor(
    private readonly db: AngularFirestore,
    private progressBar: ProgressBarService,
    private auth: AngularFireAuth
  ) {
    this.spotsCollection = this.db.collection<Api.Spot>(this.spotsPath);
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
   * Get a spot
   */
  public async get(id: string) {
    return this.spotsCollection.doc(id).ref.get();
  }

  /**
   * Get spots around given location
   */
  public getSpotsAroundLocation(location: {
    latitude: number;
    longitude: number;
  }): AngularFirestoreCollection<Api.Spot> {
    const { latitude, longitude } = location;

    return this.db.collection<Api.Spot>(this.spotsPath, spotsRef =>
      spotsRef.where('location.longitude', '>=', longitude - 1).limit(50)
    );
  }

  /**
   * Add a Spot
   */
  public async add(spot: Api.Spot) {
    const id = this.db.createId();
    return this.db.doc(this.spotsPath + '/' + id).set({ ...spot, id });
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
  public like(spot: Api.Spot): Promise<void> {
    return new Promise((resolve, reject) => {
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
