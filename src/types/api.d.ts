export declare namespace Api {
  interface Spot {
    id: string;
    name: string;
    type: Type;
    description: string;
    difficulty: Difficulty;
    disciplines: Array<Disciplines>;
    location: Location;
    indoor: boolean;
    media: {
      pictures: Array<string>;
      videos: Array<string>;
    };
  }

  interface Location {
    latitude: number;
    longitude: number;
    placeId: string;
    address: string;
  }

  type Difficulty = 'easy' | 'mid' | 'pro' | 'mixed';

  type Disciplines = 'BMX' | 'skate' | 'roller';

  type Type = 'park' | 'street' | 'dirt' | 'street-park' | 'bowl';
}
