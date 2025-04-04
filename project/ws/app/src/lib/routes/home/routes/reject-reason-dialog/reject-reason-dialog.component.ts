import { Component, OnInit } from '@angular/core'
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'

@Component({
  selector: 'ws-app-reject-reason-dialog',
  templateUrl: './reject-reason-dialog.component.html',
  styleUrls: ['./reject-reason-dialog.component.scss'],
})
export class RejectReasonDialogComponent implements OnInit {
  reasonForm!: UntypedFormGroup

  constructor(public dialogRef: MatDialogRef<RejectReasonDialogComponent>) {
    this.reasonForm = new UntypedFormGroup({
      reason: new UntypedFormControl('', [Validators.required, Validators.maxLength(500)]),
    })
  }

  ngOnInit() {
  }

  onSubmit() {
    // console.log('this.reasonForm.value', this.reasonForm.value)
    this.dialogRef.close(this.reasonForm.value)
  }

}
