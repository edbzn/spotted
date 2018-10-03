import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotComponent } from './spot.component';
import { TestModule } from '../../../test.module.spec';
import { Api } from 'src/types/api';
import { offlineAuthServiceStub } from '../../authentication/auth.fake-auth.service.spec';
import { AuthService } from '../../authentication/auth.service';

const fakeSpot = {
  difficulty: 'mid' as Api.Difficulty,
  disciplines: ['BMX', 'roller', 'skate'] as Api.Disciplines[],
  id: 'WJGgZzMPdiqliPphoU8e',
  indoor: true,
  likes: {
    byUsers: ['9zBNvhHWYYZ44s9xZkN5FwLtQvH3'],
    count: 1,
  },
  location: {
    address: '198 Avenue Thiers, 69006 Lyon, France',
    latitude: 45.76522184368056,
    longitude: 4.861799647333101,
    placeId: 'ChIJk2h1h4jq9EcRX7eF4XScoKM',
  },
  media: {
    pictures: [
      // tslint:disable-next-line:max-line-length
      'https://firebasestorage.googleapis.com/v0/b/spotted-1528021262358-rmuk0/o/medias%2Fspot-media-1537904214816?alt=media&token=6d330bff-2141-465f-827a-451dbf5b7d8a',
      // tslint:disable-next-line:max-line-length
      'https://firebasestorage.googleapis.com/v0/b/spotted-1528021262358-rmuk0/o/medias%2Fspot-media-1537904173786?alt=media&token=d4342dcf-6e52-45e0-8b84-72d798f69d30',
    ],
    videos: [],
  },
  name: 'Spot Rue Vendôme',
  type: 'rail' as Api.Type,
};

describe('SpotComponent', () => {
  let component: SpotComponent;
  let fixture: ComponentFixture<SpotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [{ provide: AuthService, useValue: offlineAuthServiceStub }],
      declarations: [SpotComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotComponent);
    component = fixture.componentInstance;
    component.spot = fakeSpot;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
