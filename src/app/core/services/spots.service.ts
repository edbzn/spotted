import { Api } from '../../../types/api';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentSnapshot,
} from 'angularfire2/firestore';
import { tap, delay, take, map } from 'rxjs/internal/operators';
import { ProgressBarService } from './progress-bar.service';

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
    this.spots = this.spotsCollection.valueChanges();

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
  public get(id: string) {
    // const doc = await this.spotsCollection.doc(id).ref.get();
    return this.spotsCollection.valueChanges().pipe(
      map(spots => {
        console.log(spots);
        return spots.filter(spot => spot.id === id)[0];
      }),
      take(1)
    );
    // if (doc.exists) {
    //   return doc.data() as Api.Spot;
    // }

    // throw new Error('doc with id ' + id + ' does not exists');
  }

  /**
   * Add a Spot
   */
  public add(spot: Api.Spot): void {
    this.spotsCollection.add({ ...spot, id: this.db.createId() });
  }

  /**
   * Update a Spot
   */
  public update(id: string, spot: Api.Spot): void {
    this.spotsCollection.doc(id).update(spot);
  }

  /**
   * Delete a Spot
   */
  public delete(id: string): void {
    this.spotsCollection.doc(id).delete();
  }
}
