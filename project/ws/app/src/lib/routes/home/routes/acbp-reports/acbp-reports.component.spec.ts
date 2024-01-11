import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AcbpReportsComponent } from './acbp-reports.component'


describe('AcbpReportsComponent', () => {
  let component: AcbpReportsComponent
  let fixture: ComponentFixture<AcbpReportsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcbpReportsComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AcbpReportsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
