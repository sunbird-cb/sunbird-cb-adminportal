
import { MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfigurationsService } from '../../services/configurations.service'
import { ValueService } from './value.service'
import { ImageCropComponent } from './image-crop.component'

describe('ImageCropComponent', () => {
  let component: ImageCropComponent

  const dialogRef: Partial<MatDialogRef<ImageCropComponent>> = {}
  const configSvc: Partial<ConfigurationsService> = {}
  const snackBar: Partial<MatSnackBar> = {}
  const valueSvc: Partial<ValueService> = {}
  const data: any = {}

  beforeAll(() => {
    component = new ImageCropComponent(
      dialogRef as MatDialogRef<ImageCropComponent>,
      configSvc as ConfigurationsService,
      snackBar as MatSnackBar,
      valueSvc as ValueService,
      data as any
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
