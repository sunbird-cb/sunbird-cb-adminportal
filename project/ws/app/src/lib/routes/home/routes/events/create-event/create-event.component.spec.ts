import { ChangeDetectorRef } from '@angular/core'
import { EventsService } from '../services/events.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
import { ProfileV2UtillService } from '../services/home-utill.service'
import { PipePublicURL } from '../../../pipes/pipe-public-URL/pipe-public-URL.pipe'
import { CreateEventComponent } from './create-event.component'

describe('CreateEventComponent', () => {
	let component: CreateEventComponent

	const snackBar: Partial<MatSnackBar> = {}
	const eventsSvc: Partial<EventsService> = {}
	const matDialog: Partial<MatDialog> = {}
	const router: Partial<Router> = {}
	const configSvc: Partial<ConfigurationsService> = {}
	const changeDetectorRefs: Partial<ChangeDetectorRef> = {}
	const activeRoute: Partial<ActivatedRoute> = {}
	const events: Partial<EventService> = {}
	const profileUtilSvc: Partial<ProfileV2UtillService> = {}
	const pipePublic: Partial<PipePublicURL> = {}

	beforeAll(() => {
		component = new CreateEventComponent(
			snackBar as MatSnackBar,
			eventsSvc as EventsService,
			matDialog as MatDialog,
			router as Router,
			configSvc as ConfigurationsService,
			changeDetectorRefs as ChangeDetectorRef,
			activeRoute as ActivatedRoute,
			events as EventService,
			profileUtilSvc as ProfileV2UtillService,
			pipePublic as PipePublicURL
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
