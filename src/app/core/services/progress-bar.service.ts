import { EventEmitter, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProgressBarService {
  public updateProgressBar: EventEmitter<string> = new EventEmitter<string>();

  private requestsRunning = 0;

  public list(): number {
    return this.requestsRunning;
  }

  public increase(): void {
    this.requestsRunning++;
    if (this.requestsRunning >= 1) {
      this.updateProgressBar.emit('indeterminate');
    }
  }

  public decrease(): void {
    if (this.requestsRunning > 0) {
      this.requestsRunning--;
      if (this.requestsRunning === 0) {
        this.updateProgressBar.emit('none');
      }
    }
  }
}
