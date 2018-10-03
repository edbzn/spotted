import { userMock } from './auth.fake-fire-auth.service.spec';

const fakeSignInHandler = async (): Promise<any> => {
  offlineAuthServiceStub.user = userMock;
  offlineAuthServiceStub.authenticated = true;
  onlineAuthServiceStub.user = userMock;
  onlineAuthServiceStub.authenticated = true;
};

const fakeSignOutHandler = async (): Promise<any> => {
  offlineAuthServiceStub.user = null;
  offlineAuthServiceStub.authenticated = false;
  onlineAuthServiceStub.user = null;
  onlineAuthServiceStub.authenticated = false;
};

export const offlineAuthServiceStub = {
  authenticated: false,
  user: null,
  login: jasmine.createSpy('login').and.callFake(fakeSignInHandler),
  register: jasmine.createSpy('register').and.callFake(fakeSignInHandler),
  logout: jasmine.createSpy('logout').and.callFake(fakeSignOutHandler),
};

export const onlineAuthServiceStub = {
  authenticated: true,
  user: userMock,
  login: jasmine.createSpy('login').and.callFake(fakeSignInHandler),
  register: jasmine.createSpy('register').and.callFake(fakeSignInHandler),
  logout: jasmine.createSpy('logout').and.callFake(fakeSignOutHandler),
};
