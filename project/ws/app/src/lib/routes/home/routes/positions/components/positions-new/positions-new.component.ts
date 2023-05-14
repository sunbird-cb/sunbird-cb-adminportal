
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { DialogConfirmComponent } from '../../../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'
import { PositionsService } from '../../services/position.service'

@Component({
  selector: 'ws-app-positions-new',
  templateUrl: './positions-new.component.html',
  styleUrls: ['./positions-new.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class PositionsNewComponent implements OnInit {
  positionForm!: FormGroup
  posData: any

  constructor(
    private snackBar: MatSnackBar,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private positionSvc: PositionsService,
    private dialogue: MatDialog
  ) {
    const currentState = this.route.getCurrentNavigation()
    if (currentState && currentState.extras.state) {
      console.log('currentState', currentState.extras.state.row)
      this.posData = currentState.extras.state.row
    }
    this.positionForm = new FormGroup({
      fullname: new FormControl({ value: this.posData.firstName, disabled: true }, []),
      email: new FormControl({ value: this.posData.email, disabled: true }, []),
      mobile: new FormControl({ value: this.posData.mobile, disabled: true }, []),
      position: new FormControl(this.posData.position, [Validators.required, Validators.maxLength(500), Validators.pattern(/^[\w]+([-_\s]{1}[a-z0-9]+)*$/i)]),
      description: new FormControl(this.posData.description, [Validators.required, Validators.maxLength(500), Validators.pattern(/^[\w]+([-_\s]{1}[a-z0-9]+)*$/i)]),
      wfId: new FormControl(this.posData.wfId),
    })
  }
  ngOnInit(): void {

  }
  onSubmit() {
    const dialogRef = this.dialogue.open(DialogConfirmComponent, {
      data: {
        title: 'Attention!!',
        bodyHTML: `Please click No if you are not sure about new position, otherwise click Yes
        <br />  Note: <strong>No further EDIT Or Delete will be allowed!</strong>`,
      },
    })

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        // const data = {
        //   request: {
        //     contextType: 'position',
        //     contextData: this.positionForm.controls['description'].value.toUpperCase(),
        //     contextName: this.positionForm.controls['name'].value,
        //   },
        // }
        const data = {
          state: 'IN_PROGRESS',
          action: 'APPROVE',
          serviceName: 'position',
          wfId: '6945db82-b74b-4ad8-8ce2-fef0cdc54515',
          applicationId: '12345',
          userId: '12345',
          actorUserId: '12345',
          deptName: 'DEPT OF ANIMAL PROTECTION',
          updateFieldValues: [
            {
              toValue: {
                position: 'Secretery General',
              },
              fieldKey: 'position',
              description: 'Secretery General',
              firstName: 'Manas',
              email: 'manas.swain@tarento.com',
              mobile: '9078011660',
            },
          ],
        }
        this.positionSvc.approveNewPosition(data).subscribe(() => {
          this.openSnackbar('Success!')
          this.route.navigate(['active-positions'], { relativeTo: this.activatedRoute.parent })

        })
      } else {
        this.openSnackbar('Cancelled', 5000)
        this.positionForm.reset()
      }
    })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}
