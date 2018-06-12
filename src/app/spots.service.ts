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
  private spotsCollection: AngularFirestoreCollection<any>;

  /**
   * Exposed Spots
   */
  public spots: Observable<any[]>;

  constructor(readonly db: AngularFirestore) {
    this.spotsCollection = db.collection<any>('spots');
    this.spots = this.spotsCollection.valueChanges();
  }

  /**
   * Add a Spot
   */
  public add(spot: any): void {
    this.spotsCollection.add(spot);
  }

  /**
   * Update a Spot
   */
  public update(id: string, spot: any): void {
    this.spotsCollection.doc(id).update(spot);
  }

  /**
   * Delete a Spot
   */
  public delete(id: string): void {
    this.spotsCollection.doc(id).delete();
  }
}
