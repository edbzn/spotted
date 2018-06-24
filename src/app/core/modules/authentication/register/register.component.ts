import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { from } from 'rxjs';
import { mergeMapTo, mergeMap } from 'rxjs/internal/operators';
import { TranslateService } from '@ngx-translate/core';
import { appConfiguration } from '../../../../app-config';
import { PasswordValidation } from '../../../../shared/match-password.validator';
import { fadeAnimation } from '../../../../shared/router-animation';

@Component({
  selector: 'spt-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [fadeAnimation],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fadeAnimation]': '' },
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  @ViewChild('emailInput') emailInput;

  get email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get name(): FormControl {
    return this.registerForm.get('name') as FormControl;
  }

  get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(appConfiguration.forms.nameMinLength),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
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

  onSubmit(): void {
    if (this.registerForm.invalid) {
      // @todo translate

      this.snackBar.open('Veuillez remplir correctement le formulaire.');
      return;
    }

    // @todo translate
    this.snackBar.open('Connection');

    from(
      this.auth.auth.createUserWithEmailAndPassword(
        this.email.value,
        this.password.value
      )
    )
      .pipe(
        mergeMapTo(this.auth.user),
        mergeMap(user =>
          from(
            user.updateProfile({
              displayName: this.name.value,
              photoURL: appConfiguration.defaultPhotoUrl,
            })
          )
        )
      )
      .subscribe(
        () => {
          this.translate.get(['connected']).subscribe(texts => {
            this.snackBar.open(texts.connected, 'ok');
            this.router.navigate(['/']);
          });
        },
        () => {
          this.translate.get(['user.error']).subscribe(texts => {
            this.snackBar.open(texts['user.error']);
          });
        }
      );
  }
}
