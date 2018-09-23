import { Injectable, Inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { WINDOW } from './window.service';
import { MatSnackBar } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class UpdateService {
  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
    @Inject(WINDOW) private window: Window
  ) {}

  public checkForUpdate(): void {
    console.log('[App] checkForUpdate started');
    this.swUpdate
      .checkForUpdate()
      .then(() => {
        console.log('[App] checkForUpdate completed');
      })
      .catch(err => {
        console.error(err);
      });
  }

  public activateUpdate(): void {
    console.log('[App] activateUpdate started');
    this.swUpdate
      .activateUpdate()
      .then(() => {
        console.log('[App] activateUpdate completed');
        this.window.location.reload();
      })
      .catch(err => {
        console.error(err);
      });
  }

  public handleVersionUpdate(): void {
    this.swUpdate.available.subscribe(event => {
      console.log(
        '[App] Update available: current version is',
        event.current,
        'available version is',
        event.available
      );

      const snackBarRef = this.snackBar.open(
        'Newer version of the app is available',
        'Refresh'
      );

      snackBarRef.onAction().subscribe(() => {
        this.window.document.location.reload();
      });
    });
  }
}
