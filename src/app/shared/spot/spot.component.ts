import { SpotsService } from './../../core/services/spots.service';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Api } from '../../../types/api';
import { NguCarousel } from '@ngu/carousel';
import { DeviceDetectorService } from '../../core/services/device-detector.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'spt-spot',
  templateUrl: './spot.component.html',
  styleUrls: ['./spot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpotComponent implements OnInit {
  /**
   * Spot data
   */
  @Input() spot: Api.Spot;

  /**
   * Display card actions
   */
  @Input() withActions = true;

  /**
   * Locate a spot on a map
   */
  @Output() locate = new EventEmitter<Api.Spot>();

  /**
   * Carousel options
   */
  carousel: NguCarousel = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 400,
    interval: 4000,
    point: {
      visible: false,
    },
    load: 2,
    touch: true,
    loop: true,
    custom: 'banner',
  };

  /**
   * Pending request
   */
  loading: boolean;

  constructor(
    private deviceDetector: DeviceDetectorService,
    public spotsService: SpotsService,
    public auth: AngularFireAuth
  ) { }

  ngOnInit() { }

  onCarouselMove(spot: Api.Spot): void {
    if (this.deviceDetector.detectMobile()) {
      return;
    }

    this.locate.emit(spot);
  }

  async like() {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.auth.user.subscribe(async user => {
      await this.spotsService.like(this.spot.id, this.spot, user);
      this.loading = false;
    });
  }
}
