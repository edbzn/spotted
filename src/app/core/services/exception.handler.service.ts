import * as Raven from 'raven-js';
import { ErrorHandler } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { AngularFireAuth } from 'angularfire2/auth';
import { filter, take } from 'rxjs/operators';

export class ExceptionHandler implements ErrorHandler {
  constructor(auth: AngularFireAuth) {
    const raven = Raven.config(environment.ravenDNS).install();

    raven.setEnvironment(
      environment.production === true ? 'production' : 'development'
    );

    auth.user
      .pipe(
        filter(user => !!user),
        take(1)
      )
      .subscribe(user => {
        raven.setUserContext({
          email: user.email,
          id: user.uid,
        });
      });
  }

  handleError(err: any): void {
    if (environment.production) {
      Raven.captureException(err.originalError || err);
    }

    console.error(err.originalError || err);
  }
}
