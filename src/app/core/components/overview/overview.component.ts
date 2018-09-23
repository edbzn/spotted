import { AuthService } from './../../../authentication/auth.service';
import { WINDOW } from '../../../core/services/window.service';
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
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { SpotsService } from '../../../core/services/spots.service';
import { Api } from '../../../../types/api';
import { MatStepper, MatSnackBar } from '@angular/material';
import { UploadService } from '../../../core/services/upload.service';
import { GeocoderService } from '../../../core/services/geocoder.service';
import { Subject, Subscription } from 'rxjs';
import {
  flatMap,
  tap,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs/internal/operators';
import { appConfiguration } from '../../../app-config';
import { TranslateService } from '@ngx-translate/core';
import { NguCarouselConfig } from '@ngu/carousel';
import { slideInOut } from 'src/app/shared/animations';
import { Loadable, InitializationState } from '../../../shared/loadable';

@Component({
  selector: 'spt-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOut],
})
export class OverviewComponent extends Loadable
  implements OnInit, OnDestroy, OnChanges {
  /**
   * Form ref
   */
  spotForm: FormGroup;

  /**
   * Stepper ref
   */
  @ViewChild('stepper')
  stepper: MatStepper;

  /**
   * Spots collection
   */
  @Input()
  spots: Api.Spot[] = [];

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
  @Output()
  removeHelpMarker: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Point to the given LatLng on the map
   */
  @Output()
  flyTo: EventEmitter<LatLng> = new EventEmitter<LatLng>();

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
   * Status changes used to display last pre visualization step
   */
  formStatusChangeSub: Subscription;

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
    public upload: UploadService,
    public auth: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.spotForm = this.fb.group({
      name: ['', Validators.required],
      indoor: [false, Validators.required],
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

    this.formStatusChangeSub = this.spotForm.statusChanges
      .pipe(debounceTime(1000))
      .subscribe(status => {
        if ('VALID' === status) {
          this.stepper.selectedIndex = 3;
        }
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
          const nameCtrl = this.spotForm.get('name') as FormControl;
          const street = nearest.address_components[1].long_name;

          if (nameCtrl.value === '') {
            nameCtrl.setValue('Spot ' + street);
          }

          this.location.patchValue({ address, placeId });
        })
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.spots && changes.spots.currentValue.length >= 1) {
      this.setInitializationState(InitializationState.initialized);
    }
  }

  ngOnDestroy(): void {
    this.fillSpotFormSub.unsubscribe();
    this.formStatusChangeSub.unsubscribe();
  }

  createSpot(): void {
    if (!this.valid) {
      return;
    }
    if (!this.auth.authenticated) {
      return;
    }

    const { value } = this.spotForm;
    const spotObj = value;

    this.spotsService.add(spotObj).then(() => {
      this.reset();
      this.setTabIndexTo(0);
      this.removeHelpMarker.emit();

      this.translateService.get(['spotCreated']).subscribe(texts => {
        this.snackBar.open(texts.spotCreated, 'OK');
      });
    });
  }

  trackByFn(_i: number, spot: Api.Spot): string {
    return spot.id;
  }

  setTabIndexTo(index: number): void {
    this.selectedTab = index;
  }

  fillSpotForm(latitudeLongitude: LatLng): void {
    this.fillSpotFormHandler.next(latitudeLongitude);
    this.stepper.selectedIndex = 2;
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
