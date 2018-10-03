import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailComponent } from './spot-detail.component';
import { TestModule } from '../../test.module.spec';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';

describe('SpotDetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: from([{ id: '1' }]), snapshot: {} },
        },
      ],
      declarations: [DetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
