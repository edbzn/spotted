import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PasswordValidation } from '../../../shared/match-password.validator';
import { appConfiguration } from '../../../app-config';

@Component({
  selector: 'spt-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group(
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
}
