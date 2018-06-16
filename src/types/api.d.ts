export declare namespace Api {
  interface Spot {
    id: string;
    name: string;
    type: Type;
    description: string;
    difficulty: Difficulty;
    disciplines: Array<Disciplines>;
    location: Location;
    media: {
      pictures: Array<Picture>;
      videos: Array<Video>;
    };
  }

  interface Location {
    latitude: number;
    longitude: number;
    country: string;
    postalCode: number;
    city: string;
    address: string;
  }

  interface Media {
    spotId: string;
    sourceUrl: string;
    description: string;
  }

  interface Video extends Media {}

  interface Picture extends Media {}

  type Difficulty = 'low' | 'mid' | 'hard' | 'pro' | 'hammer';

  type Disciplines = 'BMX' | 'skate' | 'roller';

  type Type = 'park' | 'street' | 'dirt' | 'street-park' | 'bowl';
}
