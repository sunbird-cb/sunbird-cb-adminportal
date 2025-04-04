
import { AvatarPhotoComponent } from './avatar-photo.component'

describe('AvatarPhotoComponent', () => {
    let component: AvatarPhotoComponent

    beforeAll(() => {
        component = new AvatarPhotoComponent(

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
