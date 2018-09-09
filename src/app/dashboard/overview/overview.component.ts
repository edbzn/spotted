import { WINDOW } from '../../core/services/window.service';
import { LatLng, latLng } from 'leaflet';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpotsService } from '../../core/services/spots.service';
import { Api } from '../../../types/api';
import { MatStepper, MatSnackBar } from '@angular/material';
import { UploadService } from '../../core/services/upload.service';
import { GeocoderService } from '../../core/services/geocoder.service';
import { Subject, Subscription } from 'rxjs';
import {
  flatMap,
  tap,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs/internal/operators';
import { appConfiguration } from '../../app-config';
import { TranslateService } from '@ngx-translate/core';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';

@Component({
  selector: 'spt-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit, OnDestroy {
  /**
   * Form ref
   */
  spotForm: FormGroup;

  /**
   * Stepper ref
   */
  stepper: MatStepper;

  /**
   * Tap index
   */
  selectedTab = 0;

  /**
   * Disciplines used in form select
   */
  disciplines: Api.Disciplines[] = appConfiguration.entities.spot.disciplines;

  /**
   * Spot types used in form select
   */
  types: Api.Type[] = appConfiguration.entities.spot.types;

  /**
   * Spot difficulty used in form select
   */
  difficulties: Api.Difficulty[] = appConfiguration.entities.spot.difficulties;

  /**
   * Emit the newly created spot to remove helper marker on the map
   */
  @Output() removeHelpMarker: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Point to the given LatLng on the map
   */
  @Output() flyTo: EventEmitter<LatLng> = new EventEmitter<LatLng>();

  /**
   * Uploaded pictures
   */
  pictures: string[] = [];

  /**
   * Handle automatic form filling and query Geocoder API with given LatLng
   */
  fillSpotFormHandler = new Subject<LatLng>();

  /**
   * Handler subscription
   */
  fillSpotFormSub: Subscription;

  /**
   * Tab scrolled event used to expand UI in use for mobile browsers
   */
  scrollChanged = new EventEmitter<Event>();

  /**
   * Carousel options
   */
  carousel: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 400,
    point: {
      visible: false,
    },
    load: 2,
    touch: true,
    loop: true,
    custom: 'banner',
  };

  /**
   * Form valid
   */
  get valid(): boolean {
    return this.spotForm.valid;
  }

  /**
   * Form touched
   */
  get dirty(): boolean {
    return this.spotForm.dirty;
  }

  /**
   * Location form part
   */
  get location(): FormGroup {
    return this.spotForm.get('location') as FormGroup;
  }

  /**
   * Media form part
   */
  get media(): FormGroup {
    return this.spotForm.get('media') as FormGroup;
  }

  constructor(
    @Inject(WINDOW) private window: Window,
    private fb: FormBuilder,
    private geocoder: GeocoderService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    public spotsService: SpotsService,
    public upload: UploadService
  ) {}

  ngOnInit() {
    this.spotForm = this.fb.group({
      name: '',
      description: '',
      indoor: false,
      difficulty: ['', Validators.required],
      type: ['', Validators.required],
      disciplines: [[], Validators.required],
      likes: {
        count: 0,
        byUsers: [],
      },
      location: this.fb.group({
        address: ['', Validators.required],
        placeId: [''],
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
      }),
      media: this.fb.group({
        pictures: [[], Validators.required],
        videos: [[]],
      }),
    });

    this.fillSpotFormSub = this.fillSpotFormHandler
      .pipe(
        tap(latitudeLongitude => {
          this.location.patchValue({
            latitude: latitudeLongitude.lat,
            longitude: latitudeLongitude.lng,
          });
        }),
        distinctUntilChanged(),
        debounceTime(appConfiguration.httpDebounceTime),
        flatMap(latitudeLongitude => this.geocoder.search(latitudeLongitude)),
        tap(results => {
          const nearest = results[0];
          const address = nearest.formatted_address;
          const placeId = nearest.place_id;

          this.location.patchValue({ address, placeId });
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.fillSpotFormSub.unsubscribe();
  }

  createSpot(): void {
    if (!this.valid) {
      return;
    }

    const { value } = this.spotForm;
    const spot: Api.Spot = { id: 1, ...value }; // <- temporary id overwritten in SpotService
    this.spotsService.add(spot);
    this.removeHelpMarker.emit();
    this.reset();

    this.translateService.get(['spotCreated']).subscribe(texts => {
      this.snackBar.open(texts.spotCreated, 'OK');
    });
  }

  trackByFn(i: number, spot: Api.Spot): string {
    return spot.id;
  }

  setTabIndexTo(index: number): void {
    this.selectedTab = index;
  }

  fillSpotForm(latitudeLongitude: LatLng): void {
    this.fillSpotFormHandler.next(latitudeLongitude);
  }

  async onFileAdded(event: any) {
    if (
      !event ||
      !event.target.files ||
      !(event.target.files instanceof FileList)
    ) {
      return;
    }

    await this.upload.files(event.target.files);

    this.upload.downloadURLs.forEach(downloadURL => {
      downloadURL.subscribe(url => {
        this.pictures.push(url);
        this.media.get('pictures').patchValue(this.pictures);
        this.changeDetector.detectChanges();
      });
    });

    this.translateService.get(['pictureUploaded']).subscribe(texts => {
      this.snackBar.open(texts.pictureUploaded, 'OK');
    });
  }

  locate(spot: Api.Spot) {
    this.flyTo.emit(latLng(spot.location.latitude, spot.location.longitude));
  }

  reset(): void {
    this.pictures = [];
    this.spotForm.reset();
    this.removeHelpMarker.emit();
  }

  descriptionCompleted(): boolean {
    return (
      this.spotForm.get('disciplines').valid &&
      this.spotForm.get('type').valid &&
      this.spotForm.get('difficulty').valid
    );
  }

  scrollTo(spot: Api.Spot): void {
    this.setTabIndexTo(0);
    this.changeDetector.detectChanges();
    const { document } = this.window;
    const wrapper = document.querySelector('.mat-tab-body-content');
    const target = document.getElementById('scroll-hook-' + spot.id);

    // @todo fix that with animation done hook
    if (target === null) {
      return;
    }

    wrapper.scrollTo({ top: target.offsetTop - 8 });
  }
}
