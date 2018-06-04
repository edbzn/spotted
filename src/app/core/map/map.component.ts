import { Component, OnInit, Inject } from '@angular/core';
import { WINDOW } from 'src/app/core/window.service';

@Component({
  selector: 'spt-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  public lat: number;
  public lng: number;

  constructor(@Inject(WINDOW) private window: Window) {}

  ngOnInit() {
    const { navigator } = this.window;

    // Try HTML5 geolocation.
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          this.lat = latitude;
          this.lng = longitude;
        },
        () => {
          // @todo center map, handle error
        }
      );
    } else {
      // Browser doesn't support Geolocation
      // @todo center map, handle error
    }
  }
}
