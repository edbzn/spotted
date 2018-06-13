import { Api } from '../../types/api';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';

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

  constructor(readonly db: AngularFirestore) {
    this.spotsCollection = db.collection<Api.Spot>('spots');
    this.spots = this.spotsCollection.valueChanges();
  }

  /**
   * Add a Spot
   */
  public add(spot: Api.Spot): void {
    this.spotsCollection.add(spot);
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
