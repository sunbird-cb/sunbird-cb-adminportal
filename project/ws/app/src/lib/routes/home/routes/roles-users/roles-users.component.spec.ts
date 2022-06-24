import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { RolesUsersComponent } from './roles-users.component'

describe('RolesUsersComponent', () => {
  let component: RolesUsersComponent
  let fixture: ComponentFixture<RolesUsersComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RolesUsersComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesUsersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
