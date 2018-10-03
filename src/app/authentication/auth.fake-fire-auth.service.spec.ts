import { BehaviorSubject } from 'rxjs';
import { appConfiguration } from '../app-config';

export const credentialsMock = {
  email: 'test@email.com',
  password: 'password',
  name: 'M. Test',
};

export const userMock = {
  uid: '45876978',
  email: credentialsMock.email,
  displayName: credentialsMock.name,
  photoURL: appConfiguration.defaultPhotoUrl,
  updateProfile: async ({ displayName, photoURL }) => {
    userMock.displayName = displayName;
    userMock.photoURL = photoURL;
  },
};

export const fakeUser = new BehaviorSubject(null);

const fakeSignInHandler = (): Promise<any> => {
  fakeUser.next(userMock);
  return Promise.resolve(userMock);
};

const fakeSignOutHandler = (): Promise<any> => {
  fakeUser.next(null);
  return Promise.resolve();
};

export const angularFireAuthStub = {
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
