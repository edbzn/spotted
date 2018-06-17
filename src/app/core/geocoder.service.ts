import { ProgressBarService } from './progress-bar.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LatLng } from 'leaflet';
import {} from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

type GeoResult = google.maps.GeocoderResult;

@Injectable({ providedIn: 'root' })
export class GeocoderService {
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private progress: ProgressBarService
  ) {}

  public search(query: LatLng): Observable<GeoResult[]> {
    this.progress.increase();

    return new Observable<GeoResult[]>(observer => {
      this.mapsAPILoader.load().then(() => {
        const result: GeoResult[] = [];
        const displaySuggestions = (
          results: GeoResult[],
          status: google.maps.GeocoderStatus
        ) => {
          if (status !== google.maps.GeocoderStatus.OK) {
            this.progress.decrease();

            return observer.error(status);
          }

          results.forEach(prediction => {
            result.push(prediction);
          });

          this.progress.decrease();
          observer.next(result);
          observer.complete();
        };

        const geoService = new google.maps.Geocoder();
        geoService.geocode(
          { location: new google.maps.LatLng(query.lat, query.lng) },
          displaySuggestions
        );
      });
    });
  }
}
