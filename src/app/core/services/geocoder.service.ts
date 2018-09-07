import { ProgressBarService } from './progress-bar.service';
import { Injectable } from '@angular/core';
import { LatLng } from 'leaflet';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

type GeoResult = google.maps.GeocoderResult;

@Injectable({ providedIn: 'root' })
export class GeocoderService {
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private progress: ProgressBarService
  ) { }

  public async search(query: LatLng): Promise<GeoResult[]> {
    this.progress.increase();

    return new Promise<GeoResult[]>((resolve, reject) => {
      this.mapsAPILoader
        .load()
        .then(() => {
          const result: GeoResult[] = [];
          const geoQuery = {
            location: new google.maps.LatLng(query.lat, query.lng),
          };
          const geoService = new google.maps.Geocoder();
          geoService.geocode(
            geoQuery,
            (results: GeoResult[], status: google.maps.GeocoderStatus) => {
              if (status !== google.maps.GeocoderStatus.OK) {
                this.progress.decrease();
                return reject(status);
              }

              results.forEach(prediction => {
                result.push(prediction);
              });

              this.progress.decrease();
              resolve(result);
            }
          );
        })
        .catch(err => {
          this.progress.decrease();
          reject(err);
        });
    });
  }
}
