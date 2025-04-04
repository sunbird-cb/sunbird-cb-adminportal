import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'ws-app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent {
  constructor(public dialogRef: MatDialogRef<InfoModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }


  confirmed() {
    let sendToParent: any = {}
    if (this.data.type === 'import-igot-master-create') {
      sendToParent.startImporting = true
    }
    else if (this.data.type === 'import-igot-master-review') {
      sendToParent.reviewImporting = false
    }
    else if (this.data.type === 'delete') {
      sendToParent.isDelete = true
    }
    this.dialogRef.close(sendToParent)
  }

  rejected() {
    let sendToParent: any = {}
    if (this.data.type === 'import-igot-master-create') {
      sendToParent.close = true
    }
    else if (this.data.type === 'import-igot-master-review') {
      sendToParent.reviewImporting = true

    }
    else if (this.data.type === 'delete') {
      sendToParent.isDelete = false
    }
    this.dialogRef.close(sendToParent)
  }

}
