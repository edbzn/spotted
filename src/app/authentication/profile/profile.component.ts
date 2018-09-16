import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { mergeMap, mergeMapTo, take, filter } from 'rxjs/internal/operators';
import { fade } from '../../shared/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'spt-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [fade],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fade]': '' },
})
export class ProfileComponent implements OnInit, OnDestroy {
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
    public auth: AngularFireAuth,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if (user) {
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
      }
    });
  }

  ngOnDestroy(): void {}

  logout(): void {
    this.auth.auth.signOut().then(() => {
      this.router.navigateByUrl('/');
    });
  }

  updateProfile(): void {
    if (!this.profileForm.valid) {
      return;
    }

    this.auth.user
      .pipe(
        filter(user => !!user),
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
        filter(user => !!user),
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
