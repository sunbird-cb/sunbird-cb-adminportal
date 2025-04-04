import { ChangeDetectorRef } from '@angular/core'
import { UsersService } from '../../../routes/home/services/users.service'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { RolesService } from '../../../routes/home/services/roles.service'
import { ActivatedRoute } from '@angular/router'
import { UserCardComponent } from './user-card.component'
import { of } from 'rxjs'
import { EventService } from '@sunbird-cb/utils'
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips'

describe('UserCardComponent', () => {
    let component: UserCardComponent

    const usersSvc: Partial<UsersService> = {
        getUserById: jest.fn().mockReturnValue(of({ profileDetails: { personalDetails: { firstname: 'Test User' } } })),
    }

    const roleservice: Partial<RolesService> = {
        getAllRoles: jest.fn(() => of({
            result: {
                response: {
                    value: JSON.stringify({ orgTypeList: ['Type1', 'Type2'] }),
                },
            },
        })),
    }

    const dialog: Partial<MatDialog> = {}

    const route: Partial<ActivatedRoute> = {
        snapshot: {
            params: { tab: 'verified' },
            queryParams: of({ roleId: 'testRoleId' }),
            data: of({
                profile: {
                    data: [{ role: 'sam' }],
                },
            }),
            parent: {
                url: of([]),
                data: of({
                    configService: {
                        userRoles: new Map([['spv_admin', true]]),
                    },
                }),
            } as any,
        } as any,
    }

    const snackBar: Partial<MatSnackBar> = {}
    const events: Partial<EventService> = {}
    const cdr: Partial<ChangeDetectorRef> = {
        detectChanges: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
        component = new UserCardComponent(
            usersSvc as UsersService,
            roleservice as unknown as RolesService,
            dialog as MatDialog,
            route as ActivatedRoute,
            snackBar as MatSnackBar,
            events as EventService,
            cdr as ChangeDetectorRef
        )
        component.usersData = [{ userId: '123', enableEdit: false }]
    })

    it('should create an instance of the component', () => {
        expect(component).toBeTruthy()
    })

    describe('onEditUser', () => {
        it('should call getUserById and set user details', () => {
            // Arrange
            const user = {
                userId: '123',
            }
            const panel = { open: jest.fn() }
            const userResponse = {
                profileDetails: {
                    additionalProperties: { externalSystemId: 'EHRMS123' },
                    professionalDetails: [{ designation: 'Developer', group: 'Dev' }],
                    personalDetails: {
                        primaryEmail: 'test@example.com',
                        mobile: '1234567890',
                        gender: 'MALE',
                        dob: '1990-01-01',
                        domicileMedium: 'English',
                        category: 'General',
                    },
                    employmentDetails: { pinCode: '123456', employeeCode: 'EMP001' },
                    organisations: {
                        roles: 'sampleROle',
                    },
                },
            }

            usersSvc.getUserById = jest.fn().mockReturnValue(of(userResponse))

            jest.spyOn(component.updateUserDataForm, 'reset')
            jest.spyOn(component.updateUserDataForm.controls['ehrmsID'], 'setValue')
            jest.spyOn(component.updateUserDataForm.controls['designation'], 'setValue')
            jest.spyOn(component.updateUserDataForm.controls['group'], 'setValue')
            jest.spyOn(component.updateUserDataForm.controls['primaryEmail'], 'setValue')
            jest.spyOn(component.updateUserDataForm.controls['mobile'], 'setValue')
            jest.spyOn(component.updateUserDataForm.controls['gender'], 'setValue')
            jest.spyOn(component.updateUserDataForm.controls['dob'], 'patchValue')
            jest.spyOn(component.updateUserDataForm.controls['domicileMedium'], 'setValue')
            jest.spyOn(component.updateUserDataForm.controls['category'], 'setValue')
            jest.spyOn(component.updateUserDataForm.controls['pincode'], 'setValue')
            jest.spyOn(component.updateUserDataForm.controls['employeeID'], 'setValue')

            // Act
            component.onEditUser(user, panel)

            // Assert
            expect(usersSvc.getUserById).toHaveBeenCalledWith(user.userId)
            expect(panel.open).toHaveBeenCalled()
            expect(component.updateUserDataForm.reset).toHaveBeenCalled()
            expect(component.updateUserDataForm.controls['ehrmsID'].setValue).toHaveBeenCalledWith('EHRMS123')
            expect(component.updateUserDataForm.controls['designation'].setValue).toHaveBeenCalledWith('Developer')
            expect(component.updateUserDataForm.controls['group'].setValue).toHaveBeenCalledWith('Dev')
            expect(component.updateUserDataForm.controls['primaryEmail'].setValue).toHaveBeenCalledWith('test@example.com')
            expect(component.updateUserDataForm.controls['mobile'].setValue).toHaveBeenCalledWith('1234567890')
            expect(component.updateUserDataForm.controls['gender'].setValue).toHaveBeenCalledWith('Male')
            expect(component.updateUserDataForm.controls['domicileMedium'].setValue).toHaveBeenCalledWith('English')
            expect(component.updateUserDataForm.controls['category'].setValue).toHaveBeenCalledWith('General')
            expect(component.updateUserDataForm.controls['pincode'].setValue).toHaveBeenCalledWith('123456')
            expect(component.updateUserDataForm.controls['employeeID'].setValue).toHaveBeenCalledWith('EMP001')
        })

        it('should set enableEdit', () => {
            // Arrange
            const user = { userId: '123' }
            const panel = { open: jest.fn() }
            const otherUser = { userId: '456' }
            component.usersData.push(otherUser)

            const userResponse = {
                profileDetails: {
                    personalDetails: { firstname: 'Test User' },
                },
            }

            usersSvc.getUserById = jest.fn().mockReturnValue(of(userResponse))

            // Act
            component.onEditUser(user, panel)

            // Assert
            expect(component.usersData[0].enableEdit).toBe(true)
            expect(component.usersData[1].enableEdit).toBe(false)
        })
    })

    describe('ngOnInit', () => {
        it('should call init method', async () => {
            jest.spyOn(component, 'init')

            component.ngOnInit()

            expect(component.init).toHaveBeenCalled()
            expect(roleservice.getAllRoles).toHaveBeenCalled()
        })
    })

    describe('enableUpdateButton', () => {
        it('should return true', () => {
            const result = component.enableUpdateButton({ needApprovalList: [{ label: 'Group' }, { label: 'Designation' }] })
            expect(result).toBe(true)
        })

        it('should return true', () => {

            const result = component.enableUpdateButton({ needApprovalList: [{ label: 'Group' }] })
            expect(result).toBe(true)
        })

        it('should return true', () => {

            const result = component.enableUpdateButton({ needApprovalList: [{ label: 'Designation' }] })
            expect(result).toBe(true)
        })
    })

    describe('ngOnChanges', () => {
        it('should order usersData by firstName if present', () => {
            component.usersData = [
                { profileDetails: { personalDetails: { firstname: 'John' } } },
                { firstName: 'John' },
            ]

            component.ngOnChanges()

            expect(component.usersData[0].profileDetails.personalDetails.firstname).toBe('John')
            expect(component.usersData[1].firstName).toBe('John')
        })

        it('should order usersData by firstName', () => {
            component.usersData = [
                { firstName: 'Charlie' },
                { profileDetails: { personalDetails: { firstname: 'Bob' } } },
            ]

            component.ngOnChanges()

            expect(component.usersData[1].firstName).toBe('Charlie')
        })
    })

    describe('ngAfterViewChecked', () => {
        it('should call detectChanges', () => {
            component.ngAfterViewChecked()
            expect(cdr.detectChanges).toHaveBeenCalled()
        })
    })

    describe('getUserMappedData', () => {
        it('should set user data', async () => {
            const approvalData = [
                { userWorkflow: { userInfo: { wid: '123' } }, needApprovalList: [] },
            ]

            await component.getUserMappedData(approvalData)

            expect(usersSvc.getUserById).toHaveBeenCalledWith('123')

        })

        it('should set noneedApprovalList', async () => {
            const approvalData = [
                {
                    userWorkflow: { userInfo: { wid: '123' } },
                    needApprovalList: [{ feildName: 'group' }],
                    user: { profileDetails: { professionalDetails: [{ designation: 'Engineer', group: 'Dev' }] } },
                },
            ]
            await component.getUserMappedData(approvalData)
        })
    })

    describe('onEditUser', () => {
        it('should call the api', () => {
            // arrange
            // act
            component.onEditUser('123', 'sample')
            // assert
            expect(usersSvc.getUserById).toHaveBeenCalled()
        })
    })

    describe('getUseravatarName', () => {
        it('should return the first name', () => {
            const user = {
                profileDetails: {
                    personalDetails: {
                        firstname: 'John',
                    },
                },
            }

            const name = component.getUseravatarName(user)
            expect(name).toBe('John')
        })

        it('should return firstName', () => {
            const user = {
                firstName: 'Doe',
            }

            const name = component.getUseravatarName(user)
            expect(name).toBe('Doe')
        })

    })

    describe('getApprovalList', () => {
        it('should set userwfData', () => {
            const approvalData = { approval: 'some-data' }

            component.getApprovalList(approvalData)
            expect(component.userwfData).toEqual(approvalData)
        })
    })
    describe('cancelSubmit', () => {
        it('should reset the form', () => {
            const user = { enableEdit: false }
            jest.spyOn(component.updateUserDataForm, 'reset')

            component.cancelSubmit(user)

            expect(component.updateUserDataForm.reset).toHaveBeenCalled()
            expect(user.enableEdit).toBe(true)
        })
    })
    describe('modifyUserRoles', () => {
        it('should add the role', () => {
            component.userRoles = new Set()
            component.modifyUserRoles('Admin')

            expect(component.userRoles.has('Admin')).toBe(true)
        })

        it('should remove the role', () => {
            component.userRoles = new Set(['Admin'])
            component.modifyUserRoles('Admin')

            expect(component.userRoles.has('Admin')).toBe(false)
        })
    })

    describe('updateTags', () => {
        it('should update selectedtags', () => {
            const profileData = {
                additionalProperties: {
                    tag: ['tag1', 'tag2'],
                },
            }

            component.updateTags(profileData)
            expect(component.selectedtags).toEqual(['tag1', 'tag2'])
        })
    })

    describe('addActivity', () => {
        it('should add a new tag', () => {
            const event = { input: { value: '' }, value: 'new tag' } as MatChipInputEvent
            component.selectedtags = []

            component.addActivity(event)

            expect(component.selectedtags).toContain('new tag')
            expect(component.isTagsEdited).toBe(true)
        })

        it('should reset the input field', () => {
            const inputMock = { value: 'new tag' }
            const event = { input: inputMock, value: 'new tag' } as MatChipInputEvent

            component.addActivity(event)

            expect(inputMock.value).toBe('')
        })
    })

    describe('removeActivity', () => {
        it('should remove the tag', () => {
            component.selectedtags = ['tag1', 'tag2']

            component.removeActivity('tag1')

            expect(component.selectedtags).not.toContain('tag1')
            expect(component.isTagsEdited).toBe(true)
        })
    })

})
