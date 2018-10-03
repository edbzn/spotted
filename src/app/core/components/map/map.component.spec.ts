import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';
import { TestModule } from 'src/test.module.spec';
import { Map } from 'leaflet';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapComponent],
      imports: [TestModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a map in DOM', () => {
    const map = (fixture.nativeElement as HTMLElement).querySelector(
      '.leaflet-container'
    );
    expect(map).toBeTruthy();
  });

  it('should have a map instantiated', () => {
    const map = component.map;
    expect(map instanceof Map).toBe(true);
  });
});
