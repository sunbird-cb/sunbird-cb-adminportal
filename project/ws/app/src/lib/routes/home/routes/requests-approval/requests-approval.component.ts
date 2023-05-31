import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSnackBar, MatDialog } from '@angular/material'
import { Router } from '@angular/router'
import { DialogConfirmComponent } from '../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'
import { RequestsService } from '../../services/onboarding-requests.service'

@Component({
  selector: 'ws-app-requests-approval',
  templateUrl: './requests-approval.component.html',
  styleUrls: ['./requests-approval.component.scss'],
})
export class RequestsApprovalComponent implements OnInit {
  positionForm!: FormGroup
  posData: any
  requestType: any
  // breadcrumbs: any
  requestObj: any
  customCharsPattern = `^[a-zA-Z0-9 \\w\-\&\(\)]*$`
  domainPattern = `^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$`

  constructor(
    private snackBar: MatSnackBar,
    private route: Router,
    private requestService: RequestsService,
    private dialogue: MatDialog) {
    const currentState = this.route.getCurrentNavigation()
    if (currentState && currentState.extras.state) {
      this.requestType = currentState.extras.state.row.serviceName
      this.posData = currentState.extras.state.row
      this.positionForm = new FormGroup({
        fullname: new FormControl({ value: this.posData.firstName, disabled: true }, []),
        email: new FormControl({ value: this.posData.email, disabled: true }, []),
        mobile: new FormControl({ value: this.posData.mobile, disabled: true }, []),
        position: new FormControl(this.requestType === 'position' ? this.posData.position : '', this.requestType === 'position' ? [Validators.required, Validators.maxLength(500), Validators.pattern(this.customCharsPattern)] : []),
        organisation: new FormControl(this.requestType === 'organisation' ? this.posData.organisation : '', this.requestType === 'organisation' ? [Validators.required, Validators.pattern(this.customCharsPattern)] : []),
        domain: new FormControl(this.requestType === 'domain' ? this.posData.domain : '', this.requestType === 'domain' ? [Validators.required, Validators.pattern(this.domainPattern)] : []),
        description: new FormControl(this.posData.description, []),
        wfId: new FormControl(this.posData.wfId),
      })
    }
  }

  ngOnInit() {
    // if (this.requestType === 'position') {
    //   this.breadcrumbs = { titles: [{ title: 'Requests', url: '/app/home/requests/position' }, { title: 'Approval', url: 'none' }] }
    // } else if (this.requestType === 'organisation') {
    //   this.breadcrumbs = { titles: [{ title: 'Requests', url: '/app/home/requests/organisation' }, { title: 'Approval', url: 'none' }] }
    // } else if (this.requestType === 'domain') {
    //   this.breadcrumbs = { titles: [{ title: 'Requests', url: '/app/home/requests/domain' }, { title: 'Approval', url: 'none' }] }
    // }
  }

  onSubmit() {
    const dialogRef = this.dialogue.open(DialogConfirmComponent, {
      data: {
        title: 'Are you sure?',
        bodyHTML: `Please click <strong>Yes</strong> to approve.`,
      },
    })

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        this.requestObj = {
          state: 'IN_PROGRESS',
          action: 'APPROVE',
          serviceName: this.requestType,
          wfId: this.posData.wfId,
          applicationId: this.posData.applicationId,
          userId: this.posData.userId,
          actorUserId: this.posData.actorUUID,
          deptName: this.posData.deptName,
          updateFieldValues: [],
        }

        if (this.requestType === 'position') {
          const formobj = {
            toValue: {
              position: this.positionForm.value.position,
            },
            fieldKey: this.requestType,
            description: this.positionForm.value.description,
            firstName: this.posData.firstName,
            email: this.posData.email,
            mobile: this.posData.mobile,
          }
          this.requestObj.updateFieldValues.push(formobj)
          // console.log('this.requestObj', this.requestObj)
          this.requestService.approveNewPosition(this.requestObj).subscribe(() => {
            this.openSnackbar('Success!')
            this.route.navigate(['/app/home/requests/position'])
          })
        } else if (this.requestType === 'organisation') {
          const formobj = {
            toValue: {
              organisation: this.positionForm.value.organisation,
            },
            fieldKey: this.requestType,
            description: this.positionForm.value.description,
            firstName: this.posData.firstName,
            email: this.posData.email,
            mobile: this.posData.mobile,
          }
          this.requestObj.updateFieldValues.push(formobj)
          // console.log('this.requestObj', this.requestObj)
          this.requestService.approveNewOrg(this.requestObj).subscribe(() => {
            this.openSnackbar('Success!')
            this.route.navigate(['/app/home/requests/organisation'])
          })
        } else if (this.requestType === 'domain') {
          const formobj = {
            toValue: {
              domain: this.positionForm.value.domain,
            },
            fieldKey: this.requestType,
            description: this.positionForm.value.description,
            firstName: this.posData.firstName,
            email: this.posData.email,
            mobile: this.posData.mobile,
          }
          this.requestObj.updateFieldValues.push(formobj)
          // console.log('this.requestObj', this.requestObj)
          this.requestService.approveNewDomain(this.requestObj).subscribe(() => {
            this.openSnackbar('Success!')
            this.route.navigate(['/app/home/requests/domain'])
          })
        }
      } else {
        this.navigateTo()
        // this.openSnackbar('Cancelled', 5000)
        // this.positionForm.reset()
      }
    })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  navigateTo() {
    if (this.requestType === 'position') {
      this.route.navigate(['/app/home/requests/position'])
    } else if (this.requestType === 'organisation') {
      this.route.navigate(['/app/home/requests/organisation'])
    } else if (this.requestType === 'domain') {
      this.route.navigate(['/app/home/requests/domain'])
    }
  }

  rejectRequest() {
    const dialogRef = this.dialogue.open(DialogConfirmComponent, {
      data: {
        title: 'Are you sure?',
        bodyHTML: `Please click <strong>Yes</strong> to reject this request.`,
      },
    })

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        this.requestObj = {
          state: 'IN_PROGRESS',
          action: 'REJECT',
          serviceName: this.requestType,
          wfId: this.posData.wfId,
          applicationId: this.posData.applicationId,
          userId: this.posData.userId,
          actorUserId: this.posData.actorUUID,
          deptName: this.posData.deptName,
          updateFieldValues: [],
        }

        if (this.requestType === 'position') {
          const formobj = {
            toValue: {
              position: this.posData.position,
            },
            fieldKey: this.requestType,
            description: this.posData.description,
            firstName: this.posData.firstName,
            email: this.posData.email,
            mobile: this.posData.mobile,
          }
          this.requestObj.updateFieldValues.push(formobj)
          this.requestService.approveNewPosition(this.requestObj).subscribe(() => {
            this.openSnackbar('Success!')
            this.route.navigate(['/app/home/requests/position'])
          })
        } else if (this.requestType === 'organisation') {
          const formobj = {
            toValue: {
              organisation: this.posData.organisation,
            },
            fieldKey: this.requestType,
            description: this.posData.description,
            firstName: this.posData.firstName,
            email: this.posData.email,
            mobile: this.posData.mobile,
          }
          this.requestObj.updateFieldValues.push(formobj)
          this.requestService.approveNewOrg(this.requestObj).subscribe(() => {
            this.openSnackbar('Success!')
            this.route.navigate(['/app/home/requests/organisation'])
          })
        } else if (this.requestType === 'domain') {
          const formobj = {
            toValue: {
              domain: this.posData.domain,
            },
            fieldKey: this.requestType,
            description: this.posData.description,
            firstName: this.posData.firstName,
            email: this.posData.email,
            mobile: this.posData.mobile,
          }
          this.requestObj.updateFieldValues.push(formobj)
          this.requestService.approveNewDomain(this.requestObj).subscribe(() => {
            this.openSnackbar('Success!')
            this.route.navigate(['/app/home/requests/domain'])
          })
        }
      } else {
        this.navigateTo()
        // this.openSnackbar('Cancelled', 5000)
        // this.positionForm.reset()
      }
    })
  }

}
