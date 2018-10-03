import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import { filter } from 'rxjs/operators';

import {
  angularFireAuthStub,
  credentialsMock,
  fakeUser,
  userMock,
} from './auth.fake-fire-auth.service.spec';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let afAuth: AngularFireAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: angularFireAuthStub },
      ],
    });

    service = TestBed.get(AuthService);
    afAuth = TestBed.get(AngularFireAuth);

    fakeUser.pipe(filter(user => user !== null)).subscribe(user => {
      afAuth.auth.currentUser = user;
    });
  });

  afterEach(() => {
    fakeUser.next(null);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated by default', () => {
    expect(service.authenticated).toBe(false);
    expect(service.user).toBe(null);
  });

  it('should be authenticated after register', async () => {
    await service.register(
      credentialsMock.email,
      credentialsMock.password,
      credentialsMock.name
    );

    expect(afAuth.auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      credentialsMock.email,
      credentialsMock.password
    );
    expect(service.authenticated).toBe(true);
    expect(service.user.email).toEqual(credentialsMock.email);
  });

  it('should be authenticated after logging in', async () => {
    await service.login(credentialsMock.email, credentialsMock.password);

    expect(afAuth.auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      credentialsMock.email,
      credentialsMock.password
    );
    expect(service.authenticated).toBeTruthy();
    expect(service.user.email).toEqual(credentialsMock.email);
  });

  it('should not be authenticated after logging out', async () => {
    fakeUser.next(userMock);
    expect(service.authenticated).toBe(true);
    expect(service.user.email).toEqual(credentialsMock.email);

    await service.logout();

    expect(service.authenticated).toBe(false);
    expect(service.user).toBe(null);
  });
});
