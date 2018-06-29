import * as Raven from 'raven-js';
import { ErrorHandler } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { AngularFireAuth } from 'angularfire2/auth';
import { filter, take } from 'rxjs/operators';

Raven.config(environment.ravenDNS).install();

export class ExceptionHandler implements ErrorHandler {
  constructor(auth: AngularFireAuth) {
    Raven.setEnvironment(
      environment.production === true ? 'production' : 'development'
    );

    auth.user
      .pipe(
        filter(user => !!user.uid),
        take(1)
      )
      .subscribe(user => {
        Raven.setUserContext({
          email: user.email,
          id: user.uid,
        });
      });
  }

  handleError(err: any): void {
    if (environment.production) {
      Raven.captureException(err.originalError || err);
    } else {
      throw new Error(err);
    }
  }
}
