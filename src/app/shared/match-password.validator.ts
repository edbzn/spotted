import { AbstractControl } from '@angular/forms';

export class PasswordValidation {
  static MatchPassword(control: AbstractControl) {
    console.log(control);
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ matchPassword: true });
    } else {
      return null;
    }
  }
}
