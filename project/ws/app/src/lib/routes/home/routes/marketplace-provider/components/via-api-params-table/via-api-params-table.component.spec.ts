import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViaApiParamsTableComponent } from './via-api-params-table.component';

describe('ViaApiParamsTableComponent', () => {
  let component: ViaApiParamsTableComponent;
  let fixture: ComponentFixture<ViaApiParamsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViaApiParamsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViaApiParamsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
