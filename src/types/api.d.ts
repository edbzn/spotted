export declare namespace Api {
  interface Spot {
    id: string;
    name: string;
    description: string;
    difficulty: Difficulty;
    disciplines: Disciplines;
    location: Location;
    tags: Array<Tag>;
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

  interface Tag {
    id: string;
    name: string;
  }

  type Difficulty = 'low' | 'mid' | 'hard' | 'pro' | 'hammer';

  type Disciplines = Array<'BMX' | 'skate' | 'roller'>;
}
