import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { appConfiguration } from '../../app-config';
import { fade } from '../../shared/animations';
import { PasswordValidation } from '../../shared/match-password.validator';
import { AuthService } from '../auth.service';

@Component({
  selector: 'spt-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [fade],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fade]': '' },
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
    public auth: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const { user } = this.auth;

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

  async updateProfile(): Promise<void> {
    if (!this.profileForm.valid) {
      return;
    }

    const { user } = this.auth;
    await user.updateEmail(this.email.value);
    await user.updateProfile({
      photoURL: user.photoURL,
      displayName: this.name.value,
    });

    this.translate
      .get(['user.profileChangedSuccess'])
      .subscribe(texts =>
        this.snackBar.open(texts['user.profileChangedSuccess'], 'OK')
      );
  }

  async updatePassword(): Promise<void> {
    if (!this.passwordForm.valid) {
      return;
    }

    const { user } = this.auth;
    await user.updatePassword(this.password.value);

    this.translate
      .get(['user.passwordChangedSuccess'])
      .subscribe(texts =>
        this.snackBar.open(texts['user.passwordChangedSuccess'], 'OK')
      );
  }
}
