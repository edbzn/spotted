import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import { Injectable } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { appConfiguration } from '../app-config';
import { Router } from '@angular/router';

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

  constructor(private auth: AngularFireAuth, private router: Router) {
    this.auth.user.subscribe(user => {
      if (user) {
        this.authenticate(user);
      }
    });
  }

  /**
   * Login using credentials
   */
  async login(email: string, password: string): Promise<User> {
    await this.auth.auth.signInWithEmailAndPassword(email, password);

    const user = this.auth.auth.currentUser;
    this.authenticate(user);

    return user;
  }

  /**
   * Register a new user
   */
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

  /**
   * Logout & redirect to the home
   */
  public async logout(redirectUrl = '/'): Promise<void> {
    await this.auth.auth.signOut();
    this.deAuthenticate();
    this.router.navigateByUrl(redirectUrl);
  }

  private authenticate(user: User): void {
    this.user = user;
    this.authenticated = true;
  }

  private deAuthenticate(): void {
    this.user = null;
    this.authenticated = false;
  }
}
