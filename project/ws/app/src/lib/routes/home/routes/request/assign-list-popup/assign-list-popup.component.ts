import { Component, Inject, OnInit } from '@angular/core'
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table'
import { RequestServiceService } from '../request-service.service'

@Component({
  selector: 'ws-app-assign-list-popup',
  templateUrl: './assign-list-popup.component.html',
  styleUrls: ['./assign-list-popup.component.scss'],
})
export class AssignListPopupComponent implements OnInit {

  requestForm!: UntypedFormGroup
  displayedColumns: string[] = ['select', 'providerName', 'details', 'eta']
  providerList: any[] = []
  dataSource: any
  providerCount: any
  pageNumber = 0
  pageSize = 5
  fullProfile: any
  userId: any
  assignText = ''
  submitAssign = ''
  currentUser: any

  constructor(private fb: UntypedFormBuilder,
              private requestService: RequestServiceService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AssignListPopupComponent>,
  ) {
    this.requestForm = this.fb.group({
      assignee: new UntypedFormControl('', Validators.required),
    })
  }

  ngOnInit() {
    this.currentUser = sessionStorage.getItem('idDetails') ? sessionStorage.getItem('idDetails') : ''
    this.assignText = 'Assign'
    this.submitAssign = 'Assign'
    this.getInterestOrgList()
  }

  setFormData() {
    if (this.data.assignedProvider) {
      this.assignText = 'Re-assign'
      this.submitAssign = 'Re-Assign'
      const assignOrgData = this.providerList.find(option =>
        this.data.assignedProvider === option.orgName
      )
      const position = this.providerList.indexOf(assignOrgData)

      // check if the element exists in the array
      if (position > -1) {
        // Remove the element from its position
        const selectedData = this.providerList.splice(position, 1)[0]

        // Add the removed element to the beginning of the array
        this.providerList.unshift(selectedData)
      }
      // if (assignOrgData) {
      //   this.requestForm.controls['assignee'].setValue(assignOrgData)
      // }

    }
  }

  getInterestOrgList() {
    const request: any = {
      filterCriteriaMap: {
        demandId: this.data.demand_id,

      },
      requestedFields: [
      ],
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    }
    this.requestService.getOrgInterestList(request).subscribe((res: any) => {
      if (res.data) {
        this.providerList = res.data
        this.providerCount = res.totalCount
        this.dataSource = new MatTableDataSource<any>(this.providerList)
        this.setFormData()
      }
    }
    )
  }

  getAssigneeList() {

  }

  onChangePage(event: any) {
    this.pageNumber = event.pageIndex
    this.pageSize = event.pageSize
    this.getInterestOrgList()
  }

  onSubmitAssign() {
    const selectedProvider = this.requestForm.value.assignee
    if (selectedProvider) {
      const request = {
        interestId: selectedProvider.interestId,
        demandId: selectedProvider.demandId,
        ownerId: selectedProvider.ownerId,
        orgId: selectedProvider.orgId,
        description: selectedProvider.description,
        turnAroundTime: selectedProvider.turnAroundTime,
        orgName: selectedProvider.orgName,
        status: selectedProvider.status,
        createdOn: selectedProvider.createdOn,
        updatedOn: selectedProvider.updatedOn,
        // assignedBy: this.currentUser,
      }
      this.requestService.assignToOrg(request).subscribe((res: any) => {
        if (res) {
          this.dialogRef.close({ data: 'confirmed' })
        }

      },                                                 (error: any) => {
        this.dialogRef.close({ error })

      }
      )
      // Implement your assign logic here
    } else {
    }
  }

  cancel() {
    this.dialogRef.close()
    // Implement your cancel logic here
  }

}
