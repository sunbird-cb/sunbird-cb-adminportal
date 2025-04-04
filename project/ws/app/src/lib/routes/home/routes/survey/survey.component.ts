import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
// import lodash from 'lodash'
import { SurveyApiService } from './survey-api/survey-api.service'
import { SolutionSurveyUploadComponent } from '../../components/solution-survey-upload/solution-survey-upload.component'
import { environment } from '../../../../../../../../../src/environments/environment'
import { ActivatedRoute } from '@angular/router'
// import { ActivatedRoute, Router } from '@angular/router'

// import { ConfigurationsService } from '@sunbird-cb/utils'
// import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
// import * as moment from 'moment'
/* tslint:disable */

// import { EventsService } from '../services/events.service'
// import { DialogConfirmComponent } from '../../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'
// import { MatSnackBar } from '@angular/material'
// import { TelemetryEvents } from '../model/telemetry.event.model'

@Component({
  selector: 'ws-app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  currentUser!: string | null
  configService: any
  department: any
  departmentID: any
  tabledata: any = []
  eventData: any = []
  data: any = []
  currentFilter = 'upcoming'
  slugForSolutionPortal = 'validation/template/template-selection'
  loadSurveyList = false
  constructor(
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    // private configSvc: ConfigurationsService,
    private surveyApiService: SurveyApiService
  ) {

    this.configService = this.activeRoute.snapshot.data.configService
    // if (this.configSvc.userProfile) {
    //   this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    //   this.department = this.configSvc.userProfile && this.configSvc.userProfile.departmentName
    //   this.departmentID = this.configSvc.userProfile && this.configSvc.userProfile.rootOrgId
    // } else {
    //   if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')) {
    //     this.departmentID = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')
    //   }
    //   if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.departmentName')) {
    //     this.department = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.departmentName')
    //     _.set(this.department, 'snapshot.data.configService.userProfile.departmentName', this.department ? this.department : '')
    //   }
    //   if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.userId')) {
    //     this.currentUser = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.userId')
    //   }
    //   if (this.configService.userProfile && this.configService.userProfile.departmentName) {
    //     this.configService.userProfile.departmentName = this.department
    //   }
    // }

  }

  ngOnInit() {
    this.tabledata = {
      actions: [{ icon: 'file_copy', label: 'Copy', name: 'ViewCount', type: 'link' }],
      columns: [
        { displayName: 'Survey Id', key: 'SOLUTION_ID', defaultValue: 'NA' },
        { displayName: 'Survey Name', key: 'SOLUTION_NAME', defaultValue: 'NA' },
        { displayName: 'Start Date', key: 'DISPLAY_START_DATE', datePipe: true },
        { displayName: 'End Date', key: 'DISPLAY_END_DATE', datePipe: true },

      ],
      needCheckBox: false,
      needHash: false,
      needUserMenus: false,
      sortColumn: true,
      sortState: 'asc',
      actionColumnName: 'Actions',
    }
    this.getSurveysData()
  }

  onCreateClick() {
    const url = `https://${environment.sitePath}/${this.slugForSolutionPortal}`
    let dialogRef = this.dialog.open(SolutionSurveyUploadComponent, {
      data: {
        surveyFileUploadUrl: url,
      },
      disableClose: true,
      width: '95%',
      height: '95%',
      panelClass: 'overflow-visable',
    })
    dialogRef.afterClosed().subscribe(() => {
      this.loadSurveyList = false
      setTimeout(() => {
        this.getSurveysData()
        this.loadSurveyList = true
      }, 0)



    })
    dialogRef.backdropClick().subscribe(() => {
      // Close the dialog
      // this.getSurveysData()
      dialogRef.close()
    })

  }

  getSurveysData() {
    this.loadSurveyList = false
    this.data = []
    const reqPayLoad = { "resourceType": "Survey" }
    this.surveyApiService.getSurveyResults(reqPayLoad).subscribe((response: any) => {
      if (response && response.status === 200) {
        if (response && response.SolutionList && response.SolutionList.length) {
          //this.data = response.SolutionList
          //this.data = response.SolutionList

          this.formatData(response.SolutionList)
        } else {
          this.loadSurveyList = true
        }
      }
    })
  }

  formatData(resData: any) {
    resData.forEach((req: any) => {
      if (req.START_DATE) {

        // const date = ('0' + (new Date(req.START_DATE).getDate())).slice(-2)
        // // const mm = new Date(val.createdOn).getMonth() + 1
        // // tslint:disable-next-line:prefer-template
        // const mm = ('0' + (new Date(req.START_DATE).getMonth() + 1)).slice(-2)
        // const year = new Date(req.START_DATE).getFullYear()
        // // tslint:disable-next-line:prefer-template
        // const createdDate = date + `-` + mm + `-` + year
        req.START_DATE_ACTUAL = JSON.parse(JSON.stringify(req.START_DATE))
        const fsdate = req.START_DATE.toLocaleString().split('T')[0]
        req.START_DATE = fsdate
        if (fsdate.includes("-")) {
          let dd = fsdate.split("-")[2]
          let mm = fsdate.split("-")[1]
          let yy = fsdate.split("-")[0]
          req.DISPLAY_START_DATE = `${dd}-${mm}-${yy}}`
        }



      }

      if (req.END_DATE) {
        // tslint:disable-next-line:prefer-template
        // const udate = ('0' + (new Date(req.END_DATE).getDate())).slice(-2)
        // // tslint:disable-next-line:prefer-template
        // const umm = ('0' + (new Date(req.END_DATE).getMonth() + 1)).slice(-2)
        // const uyear = new Date(req.END_DATE).getFullYear()
        // // tslint:disable-next-line:prefer-template
        // const updatedDate = udate + `-` + umm + `-` + uyear
        const fedate = req.END_DATE.toLocaleString().split('T')[0]
        req.END_DATE = fedate
        if (fedate.includes("-")) {
          let dd = fedate.split("-")[2]
          let mm = fedate.split("-")[1]
          let yy = fedate.split("-")[0]
          req.DISPLAY_END_DATE = `${dd}-${mm}-${yy}}`
        }


      }
      this.data.push(req)

      // this.data.sort((a: any, b: any) => {
      //   return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      // })
    })
    this.loadSurveyList = true
  }

}
