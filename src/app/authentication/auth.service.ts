import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import { Injectable } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { appConfiguration } from '../app-config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * Authentication state
   */
  public authenticated = false;

  /**
   * Logged in user
   */
  public user: User | null = null;

  constructor(private auth: AngularFireAuth) {}

  async login(email: string, password: string): Promise<User> {
    await this.auth.auth.signInAndRetrieveDataWithEmailAndPassword(
      email,
      password
    );

    const user = this.auth.auth.currentUser;
    this.authenticate(user);

    return user;
  }

  async register(email: string, password: string, name: string): Promise<User> {
    await this.auth.auth.createUserWithEmailAndPassword(email, password);
    const user = this.auth.auth.currentUser;
    await user.updateProfile({
      displayName: name,
      photoURL: appConfiguration.defaultPhotoUrl,
    });
    this.authenticate(user);

    return user;
  }

  private authenticate(user: User): void {
    this.user = user;
    this.authenticated = true;
  }
}
