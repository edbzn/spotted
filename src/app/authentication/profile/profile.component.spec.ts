import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestModule } from 'src/test.module.spec';

import { onlineAuthServiceStub } from '../auth.fake-auth.service.spec';
import { AuthService } from '../auth.service';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [{ provide: AuthService, useValue: onlineAuthServiceStub }],
      declarations: [ProfileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    authService = TestBed.get(AuthService);

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
