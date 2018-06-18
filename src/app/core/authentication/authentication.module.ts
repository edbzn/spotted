import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';

@NgModule({
  imports: [CommonModule, AuthenticationRoutingModule],
  declarations: [LoginComponent, RegisterComponent, UserComponent],
  exports: [LoginComponent],
})
export class AuthenticationModule {}
