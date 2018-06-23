import { WINDOW_PROVIDERS } from './../core/window.service';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateModule,
  TranslateLoader,
  TranslateFakeLoader,
} from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { ProgressBarService } from '../core/progress-bar.service';
import { StorageService } from '../core/storage.service';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { angularFireAuthStub } from './auth.test';

@NgModule({
  imports: [
    RouterTestingModule,
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
    }),
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    ProgressBarService,
    StorageService,
    WINDOW_PROVIDERS,
    { provide: AngularFireAuth, useValue: angularFireAuthStub },
  ],
  declarations: [],
  entryComponents: [],
  exports: [
    TranslateModule,
    RouterTestingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
  ],
})
export class TestModule {}
