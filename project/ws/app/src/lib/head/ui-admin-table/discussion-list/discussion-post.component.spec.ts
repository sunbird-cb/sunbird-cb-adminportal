import { RejectPublishService } from '../reject-publish.service'
import { MatDialog } from '@angular/material/dialog'
import { LoggerService } from '@sunbird-cb/utils'
import { UIDiscussionPostComponent } from './discussion-post.component'

describe('UIDiscussionPostComponent', () => {
    let component: UIDiscussionPostComponent

    const logger: Partial<LoggerService> = {}
    const discussion: Partial<RejectPublishService> = {}
    const dialog: Partial<MatDialog> = {}

    beforeAll(() => {
        component = new UIDiscussionPostComponent(
            logger as LoggerService,
            discussion as RejectPublishService,
            dialog as MatDialog
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
