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
import { flatMap, mergeMapTo, mergeMap } from 'rxjs/internal/operators';

@Component({
  selector: 'spt-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return this.snackBar.open('Veuillez remplir correctement le formulaire.');
    }

    this.snackBar.open('Connection...');

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
              photoURL:
                'https://api.adorable.io/avatars/210/abott@adorable.png',
            })
          )
        )
      )
      .subscribe(
        () => {
          this.snackBar.open('Vous êtes maintenant connecté', 'ok', {
            duration: 4000,
          });
          this.router.navigate(['/']);
        },
        err => {
          console.log(err);
          this.snackBar.open(`Une erreur s'est produite`, 'ok', {
            duration: 4000,
          });
        }
      );
  }
}
