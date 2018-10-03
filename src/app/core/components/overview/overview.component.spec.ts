import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewComponent } from './overview.component';
import { TestModule } from 'src/test.module.spec';
import { SpotComponent } from '../../../shared/spot/spot.component';
import { AuthService } from '../../../authentication/auth.service';
import { onlineAuthServiceStub } from '../../../authentication/auth.fake-auth.service.spec';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewComponent, SpotComponent],
      providers: [{ provide: AuthService, useValue: onlineAuthServiceStub }],
      imports: [TestModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
