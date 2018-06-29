import { NgModuleRef } from '@angular/core';

export interface Environment {
  production: boolean;
  hmr: boolean;
  ENV_PROVIDERS: any;
  showDevModule: boolean;
  googleApiKey: string;
  ravenDNS: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
  };
  decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any>;
}
