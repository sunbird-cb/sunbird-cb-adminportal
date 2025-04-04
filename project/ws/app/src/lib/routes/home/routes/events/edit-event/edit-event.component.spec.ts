
import { ChangeDetectorRef } from '@angular/core'
import { EventsService } from '../services/events.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
import { ProfileV2UtillService } from '../services/home-utill.service'
import { EditEventComponent } from './edit-event.component'
import { of } from 'rxjs'

describe('EditEventComponent', () => {
	let component: EditEventComponent

	const snackBar: Partial<MatSnackBar> = {}
	const eventsSvc: Partial<EventsService> = {
		getEventDetails: jest.fn(),
	}
	const matDialog: Partial<MatDialog> = {}
	const router: Partial<Router> = {}
	const configSvc: Partial<ConfigurationsService> = {}
	const changeDetectorRefs: Partial<ChangeDetectorRef> = {}
	const activeRoute: Partial<ActivatedRoute> = {
		params: of({}),
	}
	const events: Partial<EventService> = {}
	const profileUtilSvc: Partial<ProfileV2UtillService> = {}

	beforeAll(() => {
		component = new EditEventComponent(
			snackBar as MatSnackBar,
			eventsSvc as EventsService,
			matDialog as MatDialog,
			router as Router,
			configSvc as ConfigurationsService,
			changeDetectorRefs as ChangeDetectorRef,
			activeRoute as ActivatedRoute,
			events as EventService,
			profileUtilSvc as ProfileV2UtillService
		)
	})

	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})

	it('should create a instance of component', () => {
		expect(component).toBeTruthy()
	})
})
