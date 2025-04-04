import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelfRegistrationComponent } from './custom-self-registration.component';

describe('CustomSelfRegistrationComponent', () => {
  let component: CustomSelfRegistrationComponent;
  let fixture: ComponentFixture<CustomSelfRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomSelfRegistrationComponent]
    });
    fixture = TestBed.createComponent(CustomSelfRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
