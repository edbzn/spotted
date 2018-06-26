import { ProgressBarService } from './progress-bar.service';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { Api } from 'src/types/api';
import { Observable, from } from 'rxjs';
import { finalize } from 'rxjs/internal/operators';
import { MatSnackBar } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private path = 'medias/';

  public uploadPercent: Observable<number>;

  public downloadURL: Observable<string>;

  constructor(
    private storage: AngularFireStorage,
    private progress: ProgressBarService,
    private snackBar: MatSnackBar
  ) {}

  public file(file: File, prefix?: string) {
    this.progress.increase();

    const hash = new Date().getTime();
    const filePath = `${this.path}${prefix || 'spot-media'}-${hash}`;
    const fileRef = this.storage.ref(filePath);
    const task = fileRef.put(file);

    this.uploadPercent = task.percentageChanges();
    task
      .snapshotChanges()
      .pipe(finalize(() => (this.downloadURL = fileRef.getDownloadURL())))
      .subscribe(() => {}, () => {}, () => this.progress.decrease());

    return task.then();
  }

  public get(path: string): Observable<string> {
    return this.storage.ref(path).getDownloadURL();
  }
}
