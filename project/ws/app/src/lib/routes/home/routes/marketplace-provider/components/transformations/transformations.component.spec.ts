import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformationsComponent } from './transformations.component';

describe('TransformationsComponent', () => {
  let component: TransformationsComponent;
  let fixture: ComponentFixture<TransformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransformationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
