import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { appConfiguration } from '../app-config';
import { filter } from 'rxjs/operators';

const credentialsMock = {
  email: 'test@email.com',
  password: 'password',
  name: 'M. Test',
};

const userMock = {
  uid: '45876978',
  email: credentialsMock.email,
  displayName: credentialsMock.name,
  photoURL: appConfiguration.defaultPhotoUrl,
  updateProfile: async ({ displayName, photoURL }) => {
    userMock.displayName = displayName;
    userMock.photoURL = photoURL;
  },
};

const fakeUser = new BehaviorSubject(null);

const fakeSignInHandler = (email, password): Promise<any> => {
  fakeUser.next(userMock);
  return Promise.resolve(userMock);
};

const fakeSignOutHandler = (): Promise<any> => {
  fakeUser.next(null);
  return Promise.resolve();
};

const angularFireAuthStub = {
  user: fakeUser,
  auth: {
    currentUser: null,
    createUserWithEmailAndPassword: jasmine
      .createSpy('createUserWithEmailAndPassword')
      .and.callFake(fakeSignInHandler),
    signInWithEmailAndPassword: jasmine
      .createSpy('signInWithEmailAndPassword')
      .and.callFake(fakeSignInHandler),
    signOut: jasmine.createSpy('signOut').and.callFake(fakeSignOutHandler),
  },
};

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
