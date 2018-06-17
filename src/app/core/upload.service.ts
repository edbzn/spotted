import { ProgressBarService } from './progress-bar.service';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { Api } from 'src/types/api';
import {
  Observable,
  throwError,
  Observer,
  BehaviorSubject,
  Subject,
  of,
  from,
} from 'rxjs';
import { finalize, flatMap, delay } from 'rxjs/internal/operators';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private path = 'medias/';

  public uploadPercent: Observable<number>;

  public downloadURL: Observable<string>;

  constructor(
    private storage: AngularFireStorage,
    private progress: ProgressBarService
  ) {}

  public file(event: any, prefix?: string): Observable<string> {
    if (event instanceof Event === false) {
      return throwError(`first argument of uploadFile must be an Event type`);
    }

    this.progress.increase();

    const file = event.target.files[0];
    const hash = new Date().getTime();
    const filePath = `${this.path}${prefix || 'spot-media'}-${hash}`;
    const fileRef = this.storage.ref(filePath);
    const task = fileRef.put(file);

    this.uploadPercent = task.percentageChanges();

    return from(task.then()).pipe(
      flatMap(() => fileRef.getDownloadURL()),
      finalize(() => this.progress.decrease())
    );
  }

  public get(path: string): Observable<string> {
    return this.storage.ref(path).getDownloadURL();
  }
}
