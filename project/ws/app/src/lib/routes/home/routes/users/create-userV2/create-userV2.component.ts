import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { TenantAdminService } from '../../../services/tenant-admin.service'

@Component({
  selector: 'ws-admin-create-user',
  templateUrl: './create-userV2.component.html',
  styleUrls: ['./create-userV2.component.scss'],
})
export class CreateUserV2Component implements OnInit, OnDestroy {
  createUserForm: UntypedFormGroup
  unseenCtrl!: UntypedFormControl
  unseenCtrlSub!: Subscription
  uploadSaveData = false
  fetching = false
  departments = []
  @ViewChild('toastSuccess', { static: true }) toastSuccess!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>

  constructor(
    private snackBar: MatSnackBar,
    private tenantAdminSvc: TenantAdminService,
  ) {
    this.createUserForm = new UntypedFormGroup({
      fname: new UntypedFormControl('', [Validators.required]),
      lname: new UntypedFormControl('', [Validators.required]),
      // mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      department: new UntypedFormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    // this.unseenCtrlSub = this.createUserForm.valueChanges.subscribe(value => {
    //   console.log('ngOnInit - value', value);
    // })
    this.getUserDepartments()
  }

  ngOnDestroy() {
    if (this.unseenCtrlSub && !this.unseenCtrlSub.closed) {
      this.unseenCtrlSub.unsubscribe()
    }
  }

  onSubmit(form: any) {
    this.uploadSaveData = true
    this.tenantAdminSvc.createUser(form.value).subscribe(
      () => {
        form.reset()
        this.uploadSaveData = false
        this.openSnackbar(this.toastSuccess.nativeElement.value)
      },
      err => {
        this.openSnackbar(err.error.split(':')[1])
        this.uploadSaveData = false
      })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  getUserDepartments() {
    this.fetching = true
    this.tenantAdminSvc.getUserDepartments().then((res: any) => {
      this.fetching = false
      this.departments = res
    })
      .catch(() => { })
      .finally(() => {
        this.fetching = false
      })
  }
}
