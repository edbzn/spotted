import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { PasswordValidation } from '../../shared/match-password.validator';
import { appConfiguration } from '../../app-config';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { from } from 'rxjs';
import { mergeMap, mergeMapTo, take } from 'rxjs/internal/operators';
import { fadeAnimation } from '../../shared/router-animation';

@Component({
  selector: 'spt-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [fadeAnimation],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fadeAnimation]': '' },
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;

  get email(): FormControl {
    return this.profileForm.get('email') as FormControl;
  }

  get name(): FormControl {
    return this.profileForm.get('name') as FormControl;
  }

  get password(): FormControl {
    return this.passwordForm.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.passwordForm.get('confirmPassword') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      this.profileForm = this.fb.group({
        name: [
          user.displayName,
          [
            Validators.required,
            Validators.minLength(appConfiguration.forms.nameMinLength),
          ],
        ],
        email: [user.email, [Validators.required, Validators.email]],
      });

      this.passwordForm = this.fb.group(
        {
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(appConfiguration.forms.passwordMinLength),
            ],
          ],
          confirmPassword: [
            '',
            [
              Validators.required,
              Validators.minLength(appConfiguration.forms.passwordMinLength),
            ],
          ],
        },
        { validator: PasswordValidation.MatchPassword }
      );
    });
  }

  updateProfile(): void {
    if (!this.profileForm.valid) {
      return;
    }

    this.auth.user
      .pipe(
        mergeMap(user => from(user.updateEmail(this.email.value as string))),
        mergeMapTo(this.auth.user),
        take(1),
        mergeMap(user =>
          from(
            user.updateProfile({
              photoURL: user.photoURL,
              displayName: this.name.value,
            })
          )
        )
      )
      .subscribe(_ => {
        this.translate
          .get(['user.profileChangedSuccess'])
          .subscribe(texts =>
            this.snackBar.open(texts['user.profileChangedSuccess'], 'OK')
          );
      });
  }

  updatePassword(): void {
    if (!this.passwordForm.valid) {
      return;
    }

    this.auth.user
      .pipe(
        mergeMap(user =>
          from(user.updatePassword(this.password.value as string))
        )
      )
      .subscribe(_ => {
        this.translate
          .get(['user.passwordChangedSuccess'])
          .subscribe(texts =>
            this.snackBar.open(texts['user.passwordChangedSuccess'], 'OK')
          );
      });
  }
}
