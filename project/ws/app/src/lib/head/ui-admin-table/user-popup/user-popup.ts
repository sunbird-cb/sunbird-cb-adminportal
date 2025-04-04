import { Component, OnInit, Inject } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { CreateMDOService } from '../../../routes/home/services/create-mdo.services'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
// tslint:disable-next-line:import-spacing
// import  *  as  contentQuality  from  './content-quality.json'
export interface IDialogData {
  animal: string
  name: string
  data: any
}
@Component({
  selector: 'ws-widget-user-admin-popup',
  templateUrl: './user-popup.html',
  styleUrls: ['./user-popup.scss'],
})
export class UserPopupComponent implements OnInit {

  selectedUser: any = []
  dataSources: any
  finalArray: any = []
  tabledata: any = []
  dataTable: any = []
  score: any
  currentSelection = false
  adminButton = false
  constructor(
    public dialogRef: MatDialogRef<UserPopupComponent>,

    @Inject(MAT_DIALOG_DATA) public data: IDialogData, private createMDOService2: CreateMDOService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.createMDOService2.adminButton.subscribe((res: any) => {
      this.adminButton = res
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
  markAsComplete() {
    if (this.adminButton) {
      this.snackBar.open('User already have Admin role')
    }
    if (!this.currentSelection && !this.adminButton) {
      this.dialogRef.close({ event: 'close', data: this.selectedUser })
      this.currentSelection = true
      this.dialogRef = this.selectedUser
    }

  }
  selectedUserFrom(user: any) {
    if (this.selectedUser.lenght === 0) {
      this.selectedUser.push(user.row)
    } else {
      this.selectedUser.splice(0, this.selectedUser.length)
      this.selectedUser.push(user.row)
    }
  }
}
