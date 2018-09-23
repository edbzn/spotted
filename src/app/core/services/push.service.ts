import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SwPush } from '@angular/service-worker';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from './../../../environments/environment';

interface PushEvent {
  action: 'subscribe' | 'unsubscribe';
  subscription: PushSubscription;
}

@Injectable({ providedIn: 'root' })
export class PushService {
  private VAPID_PUBLIC_KEY = environment.VAPID_PUBLIC_KEY;
  private pushSubscriptions: AngularFirestoreCollection<PushEvent>;

  constructor(
    private swPush: SwPush,
    private snackBar: MatSnackBar,
    readonly db: AngularFirestore
  ) {
    this.pushSubscriptions = db.collection<PushEvent>('pushSubscriptions');
  }

  public subscribeToPush(): void {
    if (!this.swPush.isEnabled) {
      return;
    }

    // Requesting messaging service to subscribe current client (browser)
    this.swPush
      .requestSubscription({ serverPublicKey: this.VAPID_PUBLIC_KEY })
      .then(pushSubscription => {
        // Passing subscription object to our backend
        this.addSubscriber(pushSubscription).subscribe(
          res => {
            console.log('[App] Add subscriber request answer', res);

            this.snackBar.open('Now you are subscribed', 'ok', {
              duration: 800,
            });
          },
          err => {
            console.log('[App] Add subscriber request failed', err);
          }
        );
      })
      .catch(err => {
        console.error(err);
      });
  }

  public unsubscribeFromPush() {
    if (!this.swPush.isEnabled) {
      return;
    }

    // Get active subscription
    this.swPush.subscription.pipe(take(1)).subscribe(pushSubscription => {
      console.log('[App] pushSubscription', pushSubscription);

      // Delete the subscription from the backend
      this.deleteSubscriber(pushSubscription).subscribe(
        res => {
          console.log('[App] Delete subscriber request answer', res);

          this.snackBar.open('Now you are unsubscribed', 'ok', {
            duration: 800,
          });

          // Unsubscribe current client (browser)
          pushSubscription
            .unsubscribe()
            .then(success => {
              console.log('[App] Unsubscription successful', success);
            })
            .catch(err => {
              console.log('[App] Unsubscription failed', err);
            });
        },
        err => {
          console.log('[App] Delete subscription request failed', err);
        }
      );
    });
  }

  private addSubscriber(
    subscription: PushSubscription
  ): Observable<PushEvent[]> {
    this.pushSubscriptions.add({
      action: 'subscribe',
      subscription: Object.assign({}, subscription),
    });

    return this.pushSubscriptions.valueChanges().pipe(take(1));
  }

  private deleteSubscriber(
    subscription: PushSubscription
  ): Observable<PushEvent[]> {
    this.pushSubscriptions.add({
      action: 'unsubscribe',
      subscription: Object.assign({}, subscription),
    });

    return this.pushSubscriptions.valueChanges().pipe(take(1));
  }
}
