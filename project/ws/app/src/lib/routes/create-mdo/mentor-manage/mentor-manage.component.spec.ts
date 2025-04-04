import { ActivatedRoute, Router } from '@angular/router'
import { MentorManageComponent } from './mentor-manage.component'
import { BehaviorSubject, of, Subject } from 'rxjs'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { EventService } from '@sunbird-cb/utils'
import { LoaderService } from '../../home/services/loader.service'
import { DomSanitizer } from '@angular/platform-browser'
import { UsersService } from '../../home/services/users.service'
import { TelemetryEvents } from '../../home/routes/events/model/telemetry.event.model'

describe('MentorManageComponent', () => {
  let component: MentorManageComponent

  const mockDialog: Partial<MatDialog> = {}
  const mockRoute: Partial<ActivatedRoute> = {
    snapshot: {
      params: { tab: 'verified' },
      queryParams: of({ roleId: 'testRoleId' }),
      data: {
        configSvc: {
          userProfile: {
            userId: 'sampleId',
          },
        },
      },
    } as any,
    queryParams: of({ roleId: 'testRoleId' }),
  }
  const mockRouter: Partial<Router> = {
    navigate: jest.fn(),
  }
  const mockEvents: Partial<EventService> = {
    raiseInteractTelemetry: jest.fn(),
  }
  const mockLoaderService: Partial<LoaderService> = {
    changeLoad: new BehaviorSubject<boolean>(false),
  }
  const mockSanitizer: Partial<DomSanitizer> = {}

  const mockUserService: Partial<UsersService> = {
    mentorList$: new Subject<any>(),
    getAllUsersV3: jest.fn().mockReturnValue(of({
      content: [],
      count: 0,
      facets: [],
    })),
  }
  const mockConfigSvc = {
    userProfile: {
      userId: 'testUserId',
    },
    unMappedUser: {
      profileDetails: {
        profileStatus: 'active',
      },
      roles: ['MDO_ADMIN'],
    },
  }

  beforeAll(() => {
    component = new MentorManageComponent(
      mockDialog as MatDialog,
      mockRoute as ActivatedRoute,
      mockRouter as Router,
      mockEvents as EventService,
      mockLoaderService as LoaderService,
      mockSanitizer as DomSanitizer,
      mockUserService as UsersService
    )
    component.configSvc = mockConfigSvc
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a instance of component', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    it('should set currentFilter based on route params', () => {
      // act
      component.ngOnInit()
      // assert
      expect(component.currentFilter).toBe('verified')
    })

    it('should set rootOrgId based on query params', () => {
      // act
      component.ngOnInit()
      // assert
      expect(component.rootOrgId).toBe('testRoleId')
    })

    it('should set isMdoAdmin based on roles', () => {
      // act
      component.ngOnInit()
      // assert
      expect(component.isMdoAdmin).toBe(true)
    })

    it('should handle undefined userProfile gracefully', () => {
      // arrange
      component.configSvc = {
        unMappedUser: {
          profileDetails: { profileStatus: 'active' },
        },
      }
      // act
      component.ngOnInit()
      // assert
      expect(component.currentUser).toBe('')
    })

    it('should subscribe to mentorList$ and call getAllVerifiedUsers and getMentorUsers', () => {
      // arrange
      const getAllVerifiedUsersSpy = jest.spyOn(component, 'getAllVerifiedUsers')
      const getMentorUsersSpy = jest.spyOn(component, 'getMentorUsers')
      // act
      component.ngOnInit();
      // assert
      (mockUserService.mentorList$ as Subject<any>).next({ someData: 'test' })
      expect(getAllVerifiedUsersSpy).toHaveBeenCalledWith('')
      expect(getMentorUsersSpy).toHaveBeenCalledWith('')
    })
  })

  describe('getAllVerifiedUsers', () => {
    it('should call getAllVerifiedUsers with correct parameters', () => {
      // arrange
      const getAllVerifiedUsersSpy = jest.spyOn(component, 'getAllVerifiedUsers')
      // act
      component.ngOnInit()
      // assert
      expect(getAllVerifiedUsersSpy).toHaveBeenCalledWith('')
    })

    it('should call usersService.getAllUsersV3 with the correct request body', () => {
      // arrange
      const getAllUsersV3Spy = jest.spyOn(mockUserService, 'getAllUsersV3')
      // act
      component.ngOnInit()
      // assert
      expect(getAllUsersV3Spy).toHaveBeenCalled()
    })
  })

  describe('filterData', () => {
    it('should call getAllVerifiedUsers', () => {
      // Arrange
      const query = { searchText: 'test' }
      component.currentFilter = 'verified'
      const getAllVerifiedUsersSpy = jest.spyOn(component, 'getAllVerifiedUsers')
      // Act
      component.filterData(query)
      // Assert
      expect(getAllVerifiedUsersSpy).toHaveBeenCalledWith(query)
    })

    it('should call getMentorUsers', () => {
      // Arrange
      const query = { searchText: 'mentorTest' }
      component.currentFilter = 'mentor'
      const getMentorUsersSpy = jest.spyOn(component, 'getMentorUsers')

      // Act
      component.filterData(query)
      // Assert
      expect(getMentorUsersSpy).toHaveBeenCalledWith(query)
    })

    it('should not call any methods if currentFilter is not "verified" or "mentor"', () => {
      // Arrange
      const query = { searchText: 'otherTest' }
      component.currentFilter = 'other'
      const getAllVerifiedUsersSpy = jest.spyOn(component, 'getAllVerifiedUsers')
      const getMentorUsersSpy = jest.spyOn(component, 'getMentorUsers')
      // Act
      component.filterData(query)
      // Assert
      expect(getAllVerifiedUsersSpy).not.toHaveBeenCalled()
      expect(getMentorUsersSpy).not.toHaveBeenCalled()
    })
  })

  describe('clickHandler', () => {
    it('should call onCreateClick when event type is createUser', () => {
      // Arrange
      const onCreateClickSpy = jest.spyOn(component, 'onCreateClick')
      // Act
      component.clickHandler({ type: 'createUser' })
      // Assert
      expect(onCreateClickSpy).toHaveBeenCalled()
    })
    it('should call onUploadClick when event type is upload', () => {
      // Arrange
      const onUploadClickSpy = jest.spyOn(component, 'onUploadClick')
      // Act
      component.clickHandler({ type: 'upload' })
      // Assert
      expect(onUploadClickSpy).toHaveBeenCalled()
    })

    it('should not call any method for unknown event type', () => {
      // Arrange
      const onCreateClickSpy = jest.spyOn(component, 'onCreateClick')
      const onUploadClickSpy = jest.spyOn(component, 'onUploadClick')
      // Act
      component.clickHandler({ type: 'unknown' })

      // Assert
      expect(onCreateClickSpy).not.toHaveBeenCalled()
      expect(onUploadClickSpy).not.toHaveBeenCalled()
    })
  })

  describe('onCreateClick', () => {
    it('should navigate to create-user route and call telemetry', () => {
      // Act
      component.onCreateClick()

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/users/create-user'])
      expect(mockEvents.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: TelemetryEvents.EnumInteractTypes.CLICK,
          subType: TelemetryEvents.EnumInteractSubTypes.CREATE_BTN,
          id: 'create-user-btn',
        },
        {}
      )
    })
  })

  describe('onUploadClick', () => {
    it('should call filter with "upload"', () => {
      // Arrange
      const filterSpy = jest.spyOn(component, 'filter')
      // Act
      component.onUploadClick()
      // Assert
      expect(filterSpy).toHaveBeenCalledWith('upload')
    })
  })

  describe('onRoleClick', () => {
    it('should navigate to user details route and raise telemetry', () => {
      // Arrange
      const user = { userId: '123' }
      // Act
      component.onRoleClick(user)
      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/users/123/details'])
      expect(mockEvents.raiseInteractTelemetry).toHaveBeenCalledWith(
        {
          type: TelemetryEvents.EnumInteractTypes.CLICK,
          subType: TelemetryEvents.EnumInteractSubTypes.CARD_CONTENT,
          id: TelemetryEvents.EnumIdtype.USER_ROW,
        },
        {
          id: user.userId,
          type: TelemetryEvents.EnumIdtype.USER,
        }
      )
    })
  })

  describe('onEnterkySearch', () => {
    it('should set searchQuery and call filterData', () => {
      // Arrange
      const enterValue = 'search term'
      const filterDataSpy = jest.spyOn(component, 'filterData')
      // Act
      component.onEnterkySearch(enterValue)
      // Assert
      expect(component.searchQuery).toBe(enterValue)
      expect(filterDataSpy).toHaveBeenCalledWith(enterValue)
    })
  })

  describe('onPaginateChange', () => {
    it('should update pageIndex and limit, and call filterData', () => {
      // Arrange
      const event = { pageIndex: 1, pageSize: 10, length: 1 }
      const filterDataSpy = jest.spyOn(component, 'filterData')
      // Act
      component.onPaginateChange(event)
      // Assert
      expect(component.pageIndex).toBe(1)
      expect(component.limit).toBe(10)
      expect(filterDataSpy).toHaveBeenCalledWith(component.searchQuery)
    })
  })

  describe('showEditUser', () => {
    it('roles are provided', () => {
      // Arrange
      component.isMdoAdmin = true
      // Act
      const result = component.showEditUser(['ADMIN'])
      // Assert
      expect(result).toBe(true)
    })

    it('roles are empty', () => {
      // Arrange
      component.isMdoAdmin = true
      // Act
      const result = component.showEditUser([])
      // Assert
      expect(result).toBe(true)
    })

    it('should return true if isMdoAdmin is false', () => {
      // Arrange
      component.isMdoAdmin = false
      // Act
      const resultWithRoles = component.showEditUser(['ADMIN'])
      const resultWithoutRoles = component.showEditUser([])
      // Assert
      expect(resultWithRoles).toBe(true)
      expect(resultWithoutRoles).toBe(true)
    })
  })
})
