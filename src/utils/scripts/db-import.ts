import { initializeApp } from 'firebase';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { inspect } from 'util';
import * as uuidv1 from 'uuid/v1';
import { parseString } from 'xml2js';

import { environment } from '../../environments/environment.prod';
import { Api } from 'src/types/api';
import { GeoLocatorService } from '../../app/core/services/geo-locator.service';

const __log = process.argv.some(arg => arg === '--log');

const app = initializeApp(environment.firebase);
const db = app.database().app.firestore();
const ref = db;
const geo = new GeoLocatorService();

function command(): void {
  const file = readFileSync(resolve(__dirname, 'doc.kml'), {
    encoding: 'UTF-8',
  });

  parseString(file, (err, result) => {
    if (err) {
      throw new Error(err);
    }

    const spots: Api.Spot[] = extract(result).map(createSpot);
    spots.forEach(spot => {
      if (spot.location.latitude > 90 || spot.location.latitude < -90) {
        return;
      }

      Promise.all([
        ref.doc('spots/' + spot.id).set(spot),
        geo.set(spot.id, spot.location),
      ]).catch(_err => console.error(_err));
    });
  });
}

try {
  command();
} catch (err) {
  console.error(err);
}

function extract(root: any): PlaceMark[] {
  const document = root.kml.Document[0];
  const placeMarks: PlaceMark[] = [];

  document.Folder.forEach(folder => {
    folder.Placemark.forEach((placeMark: PlaceMark) => {
      placeMarks.push(placeMark);
    });
  });

  return placeMarks;
}

function createSpot(placeMark: PlaceMark, _index: number): Api.Spot {
  const id = uuidv1();
  const latLng = placeMark.Point[0].coordinates[0].split(',');
  const latitude = parseFloat(latLng[1]);
  const longitude = parseFloat(latLng[0]);

  return {
    id,
    type: 'park',
    difficulty: 'all',
    disciplines: ['BMX', 'roller', 'skate'],
    indoor: false,
    likes: {
      count: 0,
      byUsers: [],
    },
    location: {
      address: '',
      latitude,
      longitude,
      placeId: '',
    },
    name: placeMark.name[0],
    media: {
      pictures: [],
      videos: [],
    },
  };
}

interface PlaceMark {
  name: [string];
  description: [string];
  styleUrl: [string];
  Point: [{ coordinates: [string] }];
  ExtendedData?: [{ Data: { $: { name: string }; value: [string] }[] }];
}
