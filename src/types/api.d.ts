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
    likes: {
      count: number;
      byUsers: string[];
    };
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

  type Difficulty = 'easy' | 'mid' | 'pro' | 'all';

  type Disciplines = 'BMX' | 'skate' | 'roller';

  type Type =
    | 'curb'
    | 'rail'
    | 'ramp'
    | 'street-plaza'
    | 'park'
    | 'bowl'
    | 'dirt';
}
