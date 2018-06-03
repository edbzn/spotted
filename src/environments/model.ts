import { NgModuleRef } from '@angular/core';

export interface Environment {
  production: boolean;
  ENV_PROVIDERS: any;
  showDevModule: boolean;
  googleMapApiKey: string;
  decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any>;
}
