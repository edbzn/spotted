import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatStepper } from '@angular/material';
import { NguCarouselConfig } from '@ngu/carousel';
import { TranslateService } from '@ngx-translate/core';
import {
  ScrollToConfigOptions,
  ScrollToService,
  ScrollToEvent,
} from '@nicky-lenaers/ngx-scroll-to';
import { LatLng, latLng } from 'leaflet';
import { Subject, Subscription, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  flatMap,
  tap,
} from 'rxjs/internal/operators';
import { slideInOut } from 'src/app/shared/animations';

import { Api } from '../../../../types/api';
import { appConfiguration } from '../../../app-config';
import { GeocoderService } from '../../../core/services/geocoder.service';
import { SpotsService } from '../../../core/services/spots.service';
import { UploadService } from '../../../core/services/upload.service';
import { InitializationState, Loadable } from '../../../shared/loadable';
import { SpotComponent } from '../../../shared/spot/spot.component';
import { AuthService } from './../../../authentication/auth.service';
import { OverviewStepperIndex } from './stepper-index.enum';
import { OverviewTabIndex } from './tapbar-index.enum';

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
  selectedTab = OverviewTabIndex.SpotsAroundMeList;

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
   * Spot refs
   */
  @ViewChildren(SpotComponent, { read: ElementRef })
  spotsElementRefs: QueryList<ElementRef>;

  /**
   * Spot component refs
   */
  @ViewChildren(SpotComponent)
  spotsComponents: QueryList<SpotComponent>;

  /**
   * Spot index to scroll when tab animation needs to complete
   */
  private spotIndexToScroll: number | null = null;

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
    private scrollToService: ScrollToService,
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
          this.stepper.selectedIndex = OverviewStepperIndex.Resume;
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
      this.setTabIndexTo(OverviewTabIndex.SpotsAroundMeList);
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
    this.stepper.selectedIndex = OverviewStepperIndex.Location;
  }

  locate(spot: Api.Spot): void {
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

  onTabAnimationDone(): void {
    if (typeof this.spotIndexToScroll === 'number') {
      this.scrollToSpotIndex();
    }
  }

  triggerScrollTo(index: number): void {
    this.spotIndexToScroll = index;

    if (this.selectedTab !== OverviewTabIndex.SpotsAroundMeList) {
      this.setTabIndexTo(OverviewTabIndex.SpotsAroundMeList);
      this.changeDetector.detectChanges();
    }

    this.scrollToSpotIndex();
  }

  /**
   * @todo fix multiple upload
   */
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

  private scrollToSpotIndex(): Observable<ScrollToEvent> {
    const target = this.spotsElementRefs.find((_, i) => {
      return this.spotIndexToScroll === i;
    });

    const config: ScrollToConfigOptions = { target };
    this.changeDetector.detectChanges();

    return this.scrollToService.scrollTo(config);
  }
}
