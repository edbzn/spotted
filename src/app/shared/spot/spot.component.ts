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

  constructor(private deviceDetector: DeviceDetectorService) {}

  ngOnInit() {}

  onCarouselMove(spot: Api.Spot): void {
    if (this.deviceDetector.detectMobile()) {
      return;
    }

    this.locate.emit(spot);
  }
}
