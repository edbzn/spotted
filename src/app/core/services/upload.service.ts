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

  public downloadURLs: Observable<string>[];

  constructor(
    private storage: AngularFireStorage,
    private progress: ProgressBarService
  ) {}

  public file(file: File, prefix?: string, clearURLs = false): Promise<any> {
    const imageType = /^image\//;

    if (!imageType.test(file.type)) {
      throw new Error('Only images could be uploaded');
    }

    if (clearURLs) {
      this.downloadURLs = [];
    }

    this.progress.increase();

    const hash = new Date().getTime();
    const filePath = `${this.path}${prefix || 'spot-media'}-${hash}`;
    const fileRef = this.storage.ref(filePath);
    const task = fileRef.put(file);

    task
      .snapshotChanges()
      .pipe(finalize(() => this.downloadURLs.push(fileRef.getDownloadURL())))
      .subscribe(() => {}, () => {}, () => this.progress.decrease());

    return task.then();
  }

  public async files(files: FileList, prefix?: string): Promise<any[]> {
    this.downloadURLs = [];
    const filesToUpload: File[] = [];

    for (let index = 0; index < files.length; index++) {
      const file = files.item(index);
      filesToUpload.push(file);
    }

    return Promise.all(filesToUpload.map(file => this.file(file, prefix)));
  }

  public get(path: string): Observable<string> {
    return this.storage.ref(path).getDownloadURL();
  }
}
