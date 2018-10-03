import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from 'angularfire2/firestore';
import { from } from 'rxjs';

import { TestModule } from '../../../test.module.spec';
import { Api } from '../../../types/api';
import {
  onlineAuthServiceStub,
  offlineAuthServiceStub,
} from '../../authentication/auth.fake-auth.service.spec';
import { AuthService } from '../../authentication/auth.service';
import { SpotsService } from './spots.service';
import { GeoLocatorService } from './geo-locator.service';

let fakeSpot = {
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

const fakeSpotCopy = Object.assign(fakeSpot, {});

const input: Api.Spot[][] = [[fakeSpot]];

const data = from(input);

const collectionStub = {
  valueChanges: jasmine.createSpy('valueChanges').and.returnValue(data),
  stateChanges: jasmine.createSpy('stateChanges').and.returnValue(data),
  doc: jasmine.createSpy('doc').and.returnValue({
    ref: {
      get: () => ({
        data: () => fakeSpot,
      }),
    },
    update: async doc => {
      fakeSpot = doc;
    },
  }),
};

const locatorStub = {
  set: async () => {},
};

const angularFirestoreStub = {
  collection: jasmine.createSpy('collection').and.returnValue(collectionStub),
};

describe('SpotsService', () => {
  beforeEach(() => {
    fakeSpot = fakeSpotCopy;
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        { provide: AuthService, useValue: onlineAuthServiceStub },
        { provide: AngularFirestore, useValue: angularFirestoreStub },
        { provide: GeoLocatorService, useValue: locatorStub },
        SpotsService,
      ],
    });
  });

  it('should be created', inject([SpotsService], (service: SpotsService) => {
    expect(service).toBeTruthy();
  }));

  it('[get] method should return a Spot document', async () => {
    const service: SpotsService = TestBed.get(SpotsService);
    const document = await service.get('id');

    expect(document).toBeTruthy();
    expect(document.data()).toEqual(fakeSpot);
  });

  it('[like] method should increment likes counter', async () => {
    const service: SpotsService = TestBed.get(SpotsService);
    const document = await service.get('id');
    const spot = document.data() as Api.Spot;
    const likes = Number(fakeSpot.likes.count);
    expect(likes).toBe(fakeSpot.likes.count);

    await service.like(spot);

    expect(fakeSpot.likes.count).toBe(likes + 1);
  });

  it('[likable] method should return false if not authenticated', () => {
    TestBed.overrideProvider(AuthService, { useValue: offlineAuthServiceStub });
    const service: SpotsService = TestBed.get(SpotsService);
    expect(service.likable(fakeSpot)).toBe(false);
  });

  it('[likable] method should return false if yet liked', async () => {
    TestBed.overrideProvider(AuthService, {
      useValue: { authenticated: true, user: { uid: 'test' } },
    });
    const service: SpotsService = TestBed.get(SpotsService);
    expect(service.likable(fakeSpot)).toBe(true);

    await service.like(fakeSpot);
    expect(service.likable(fakeSpot)).toBe(false);
  });
});
