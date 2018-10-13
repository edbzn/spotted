import { initializeApp } from 'firebase';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { inspect } from 'util';
import * as uuidv4 from 'uuid/v4';
import { parseString } from 'xml2js';

import { environment } from '../../environments/environment.prod';
import { Api } from 'src/types/api';
import { GeoLocatorService } from '../../app/core/services/geo-locator.service';

interface PlaceMark {
  name: [string];
  description: [string];
  styleUrl: [string];
  Point: [{ coordinates: [string] }];
  ExtendedData?: [{ Data: { $: { name: string }; value: [string] }[] }];
}

const app = initializeApp(environment.firebase);
const db = app.database().app.firestore();
const ref = db;
const geo = new GeoLocatorService();

const run = async () => {
  try {
    await command();
  } catch (err) {
    console.error(err);
  }
};

run();

async function command(): Promise<void> {
  const file = readFileSync(resolve(__dirname, 'doc.kml'), {
    encoding: 'UTF-8',
  });

  const result = await parse(file);
  console.log(`KML Parsing Done, start extracting spots.`);

  const spots: Api.Spot[] = extract(result).map(createSpotFromPlaceMark);
  console.log(`Extract Done, start pushing [${spots.length}] spots.`);

  spots.forEach(async (spot, i) => {
    if (spot.location.latitude > 90 || spot.location.latitude < -90) {
      return console.warn(`Spot [${spot.id}] has incorrect latitude value`);
    }

    await Promise.all([
      ref.doc('spots/' + spot.id).set(spot),
      geo.set(spot.id, spot.location),
    ]);

    console.log(
      `[${(((i + 1) * 100) / spots.length)
        .toFixed(1)
        .toString()}%] Upload Done for spot [${spot.id}]`
    );
  });
}

function parse(file: string): Promise<any> {
  return new Promise((_resolve, reject) => {
    parseString(file, (err, result) => {
      if (err) {
        reject(err);
      }

      _resolve(result);
    });
  });
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

function searchPictures(placeMark: PlaceMark): string[] {
  let images: string[] = [];

  for (const key in placeMark) {
    if (placeMark.hasOwnProperty(key)) {
      const value: string = placeMark[key];

      // recursive search
      if (typeof value === 'object') {
        images = [...images, ...searchPictures(value)];
      }

      const regExp = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
      const parts = regExp.exec(value);

      if (parts !== null && parts.length > 0) {
        images.push(parts[0]);
      }
    }
  }

  return images;
}

function createSpotFromPlaceMark(
  placeMark: PlaceMark,
  _index: number
): Api.Spot {
  const id = uuidv4();
  const latLng = placeMark.Point[0].coordinates[0].split(',');
  const latitude = parseFloat(latLng[1]);
  const longitude = parseFloat(latLng[0]);
  const pictures = searchPictures(placeMark);

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
      pictures,
      videos: [],
    },
  };
}
