import { BehaviorSubject } from 'rxjs';

export const credentialsMock = {
  email: 'abc@123.com',
  password: 'password',
};

export const userMock = {
  uid: 'ABC123',
  email: credentialsMock.email,
};

export const fakeAuthState = new BehaviorSubject(null);

export const fakeSignInHandler = (
  email: string,
  password: string
): Promise<any> => {
  fakeAuthState.next(userMock);
  return Promise.resolve(userMock);
};

export const fakeSignOutHandler = (): Promise<any> => {
  fakeAuthState.next(null);
  return Promise.resolve();
};

export const angularFireAuthStub = {
  authState: fakeAuthState,
  auth: {
    createUserWithEmailAndPassword: jasmine
      .createSpy('createUserWithEmailAndPassword')
      .and.callFake(fakeSignInHandler),
    signInWithEmailAndPassword: jasmine
      .createSpy('signInWithEmailAndPassword')
      .and.callFake(fakeSignInHandler),
    signOut: jasmine.createSpy('signOut').and.callFake(fakeSignOutHandler),
  },
};
