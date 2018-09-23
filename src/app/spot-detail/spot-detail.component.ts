import { Component, AfterViewInit } from '@angular/core';
import { fade } from '../shared/animations';
import { SpotsService } from '../core/services/spots.service';
import { ActivatedRoute } from '@angular/router';
import { Api } from 'src/types/api';
import { AngularFireAuth } from 'angularfire2/auth';
import { appConfiguration } from '../app-config';
import {
  tileLayer,
  Layer,
  latLng,
  LatLng,
  MapOptions,
  popup,
  Map,
} from 'leaflet';
import { Loadable, InitializationState } from '../shared/loadable';

@Component({
  selector: 'spt-detail',
  templateUrl: './spot-detail.component.html',
  styleUrls: ['./spot-detail.component.scss'],
  animations: [fade],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fade]': '' },
})
export class DetailComponent extends Loadable implements AfterViewInit {
  /**
   * Spot data
   */
  spot: Api.Spot;

  /**
   * Map zoom
   */
  zoom = appConfiguration.map.zoom;

  /**
   * Map layers
   */
  layers: Layer[] = [];

  /**
   * Gmap tile Layer
   */
  googleMaps: Layer = tileLayer(
    'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      detectRetina: true,
    }
  );

  /**
   * Gmap street tile Layer
   */
  googleHybrid: Layer = tileLayer(
    'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
    {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      detectRetina: true,
    }
  );

  /**
   * Layers control object with our two base layers and the three overlay layers
   */
  layersControl = {
    baseLayers: {
      'Google Maps': this.googleMaps,
      'Google Street': this.googleHybrid,
    },
    overlays: {},
  };

  /**
   * Map options
   */
  options: MapOptions;

  /**
   * Map ref
   */
  map: Map;

  /**
   * Computed spot position
   */
  get center(): LatLng {
    const { latitude, longitude } = this.spot.location;

    return latLng(latitude, longitude);
  }

  constructor(
    public spotsService: SpotsService,
    public auth: AngularFireAuth,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngAfterViewInit() {
    // get spot data from router param
    this.route.params.subscribe(params => {
      this.spotsService.get(params.id).then(spot => {
        this.spot = spot.data() as Api.Spot;
        this.options = {
          layers: [this.googleMaps],
          zoom: this.zoom,
          center: this.center,
          tap: true,
          zoomControl: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          dragging: false,
        };
        this.setInitializationState(InitializationState.initialized);
      });
    });
  }

  onMapReady(map: Map): void {
    this.map = map;
    this.layers = [this.mapSpotToMarker(this.spot)];
  }

  /**
   * Create marker from spot data
   */
  private mapSpotToMarker(spot: Api.Spot): Layer {
    const marker = popup({
      maxWidth: 400,
      minWidth: 200,
      maxHeight: 400,
      autoPan: false,
      keepInView: true,
      closeButton: false,
      autoClose: false,
      closeOnClick: false,
    });

    const { latitude, longitude } = spot.location;

    // @todo crate a popup-content Angular component
    // @todo make a component factory that compile the popup-content in HTML
    // @todo append this HTML Element
    marker.setContent(`
        <article>
          <div class="description">
            <div>${spot.type.toUpperCase()}</div>
            <div>${spot.name}</div>
            <div class="address">${spot.location.address}</div>
          </div>
        </article>
      `);
    marker.setLatLng(new LatLng(latitude, longitude));
    marker.openOn(this.map);

    return marker;
  }
}
