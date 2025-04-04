import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViaApiComponent } from './via-api.component';

describe('ViaApiComponent', () => {
  let component: ViaApiComponent;
  let fixture: ComponentFixture<ViaApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViaApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViaApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
