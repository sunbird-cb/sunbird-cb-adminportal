import { Component, Inject, OnInit, Optional } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'ws-app-conformation-popup-designation-popup',
  templateUrl: './conformation-popup-designation.component.html',
  styleUrls: ['./conformation-popup-designation.component.scss'],
})
export class ConformationPopupDesignationComponent implements OnInit {

  dialogDetails: any

  constructor(
    @Optional() public dialogRef: MatDialogRef<ConformationPopupDesignationComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.dialogDetails = this.data
  }

  ngOnInit() {
  }

  closePopup(event: any) {
    this.dialogRef.close(event)
  }

}
