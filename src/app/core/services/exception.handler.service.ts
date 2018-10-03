import { ErrorHandler } from '@angular/core';
import * as Raven from 'raven-js';

import { environment } from '../../../environments/environment';

const raven = Raven.config(environment.ravenDNS).install();

raven.setEnvironment(
  environment.production === true ? 'production' : 'development'
);

export function provideErrorHandler() {
  if (environment.production) {
    return new RavenErrorHandler();
  } else {
    return new ErrorHandler();
  }
}

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err.originalError || err);
  }
}
