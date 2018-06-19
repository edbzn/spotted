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

@Component({
  selector: 'spt-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  loginForm: FormGroup;

  @ViewChild('emailInput') emailInput;

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return this.snackBar.open('Veuillez remplir correctement le formulaire.');
    }

    this.snackBar.open('Connection...');

    this.auth.auth
      .signInAndRetrieveDataWithEmailAndPassword(
        this.email.value,
        this.password.value
      )
      .then(
        token => {
          this.snackBar.open('Vous êtes maintenant connecté', 'ok', {
            duration: 4000,
          });
          this.router.navigate(['preparation']);
        },
        err => {
          this.snackBar.open(`Une erreur s'est produite`, 'ok', {
            duration: 4000,
          });
        }
      );
  }
}
