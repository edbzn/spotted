import { TranslateService } from '@ngx-translate/core';
import { ProgressBarService } from './progress-bar.service';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { Api } from 'src/types/api';
import { Observable, from } from 'rxjs';
import { finalize, flatMap } from 'rxjs/internal/operators';
import { MatSnackBar } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private path = 'medias/';

  public uploadPercent: Observable<number>;

  public downloadURL: Observable<string>;

  constructor(
    private storage: AngularFireStorage,
    private progress: ProgressBarService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  public file(file: File, prefix?: string): Observable<string> {
    this.progress.increase();

    const hash = new Date().getTime();
    const filePath = `${this.path}${prefix || 'spot-media'}-${hash}`;
    const fileRef = this.storage.ref(filePath);
    const task = fileRef.put(file);

    this.uploadPercent = task.percentageChanges();

    return from(task.then()).pipe(
      flatMap(() => fileRef.getDownloadURL()),
      finalize(() => {
        this.progress.decrease();
        this.translateService.get(['pictureUploaded']).subscribe(texts => {
          this.snackBar.open(texts.pictureUploaded, 'OK');
        });
      })
    );
  }

  public get(path: string): Observable<string> {
    return this.storage.ref(path).getDownloadURL();
  }
}
