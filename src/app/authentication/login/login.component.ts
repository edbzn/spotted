import { AuthService } from './../auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { appConfiguration } from '../../app-config';
import { fade } from '../../shared/animations';

@Component({
  selector: 'spt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fade],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fade]': '' },
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  @ViewChild('emailInput')
  emailInput;

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(appConfiguration.forms.passwordMinLength),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return this.snackBar.open('Veuillez remplir correctement le formulaire.');
    }

    this.snackBar.open('Connection...');

    this.auth.login(this.email.value, this.password.value).then(
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
