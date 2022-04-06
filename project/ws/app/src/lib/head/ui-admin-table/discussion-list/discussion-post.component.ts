import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
// import { MatCardModule } from '@angular/material'
import { MatPaginator } from '@angular/material'
import { MatSort } from '@angular/material/sort'
import * as _ from 'lodash'
import { RejectPublishService } from '../reject-publish.service'
// import {IColums } from '../interface/interfaces'
// import { Router } from '@angular/router'

import { MatDialog } from '@angular/material/dialog'
// import { ImageCroppedEvent } from 'ngx-image-cropper'
import {
  LoggerService,

} from '@sunbird-cb/utils'

import { DialogTextProfanityComponent } from './discussion-post-popup.component'
export interface IDialogData {

  profaneCategories: string[]
  text: any
  id: any
  profaneString: any
}

@Component({
  selector: 'ws-widget-discussion-post',
  templateUrl: './discussion-post.component.html',
  styleUrls: ['./discussion-post.component.scss'],
})
export class UIDiscussionPostComponent implements OnInit, OnChanges {
  @Input() tableData!: any
  @Input() data?: []
  @Input() selectedDepartment!: string
  @Input() departmentID!: string
  @Input() needCreate: Boolean = true
  @Output() clicked?: EventEmitter<any>
  @Output() actionsClick?: EventEmitter<any>
  @Output() eOnRowClick = new EventEmitter<any>()
  bodyHeight = document.body.clientHeight - 125
  // displayedColumns: IColums[] | undefined
  dataSource!: any
  widgetData: any
  length!: number
  pageSize = 5
  pageSizeOptions = [5, 10, 20]

  category: any[] = []
  discussionData: any[] = []
  profaneCategorySelected: any[] = []
  AI: any
  USER: any
  content: any
  imagePath: string
  // id: any
  // profaneString: any
  // text: any
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  @ViewChild(MatSort, { static: true }) sort?: MatSort
  selection = new SelectionModel<any>(true, [])

  constructor(
    // private router: Router,

    private logger: LoggerService,

    private discussion: RejectPublishService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<any>()
    this.actionsClick = new EventEmitter()
    this.clicked = new EventEmitter()

    this.AI = 'AI_flagged'
    this.USER = 'User_flagged'
    this.content = 'TEXT'
    this.imagePath = '/images/683.jpg'

  }

  ngOnInit() {

    this.dataSource.data = this.data
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.discussion.getCategories().subscribe((data: any) => {
      this.category = data.payload
    })

  }

  ngOnChanges(data: SimpleChanges) {
    this.tableData = null
    this.tableData = _.get(data, 'tableData.currentValue')
    this.dataSource.data = _.get(data, 'data.currentValue')
    this.length = this.dataSource.data.length
    this.paginator.firstPage()
  }

  getShortName(fullName: any) {
    return fullName.split(' ').map((n: any) => n[0]).join('')
  }

  timeframe(hours: any) {
    if (hours >= 0 && hours <= 12) {
      return 'AM'
    }

    return 'PM'

  }

  convertTimestamptoDate(timestamp: any) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const d = new Date(Number(timestamp))
    const returnDate = `${d.getDate()} ${(months[d.getMonth()])}, ${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()} ${this.timeframe(d.getHours())}`
    return returnDate
  }
  publish(id: any) {
    let temp = 0
    let publishData
    this.dataSource.data.forEach((element: any) => {
      if (element.id === id) {
        publishData = element
        publishData.classification = 'SFW'
        publishData.published = true
        this.dataSource.data.splice(temp, 1)
      }
      temp = temp + 1
    })

    const publish = { feedbackList: [publishData] }
    this.discussion.publishData(publish).subscribe((data: any) => {
      // console.log(data)
      this.logger.info(data)

    })
  }

  openDialog(id: any, text: any, profaneString: any) {

    const dialogRef = this.dialog.open(DialogTextProfanityComponent, {
      height: '90%',
      width: '50%',
      panelClass: 'reject-post',
      data: { id, text, profaneString, profaneCategories: this.category },

    })

    dialogRef.afterClosed().subscribe((result: any) => {
      let temp = 0
      let publishData
      const tempCategory: string[] = []
      this.dataSource.data.forEach((element: any) => {
        if (element.id === result.id) {

          publishData = element
          publishData.profaneStrings = result.profaneStrings
          publishData.classification = 'NSFW'
          for (const key in result.category) {
            if (result.category[key] === true) {
              tempCategory.push(key)
            }
          }

          publishData.reason = tempCategory
          publishData.comment = result.comment
          this.dataSource.data.splice(temp, 1)

        }
        temp = temp + 1
      })
      const publish = { feedbackList: [publishData] }
      this.discussion.publishData(publish).subscribe((data: any) => {
        // console.log(data)
        this.logger.info(data)

      })

    })
  }

  openDialog2(id: any, text: any, profaneString: any) {
    this.logger.info(text, id, profaneString)

    // const dialogRef = this.dialog.open(DialogOverviewExampleDialogImage, {
    //   // height: '90%',
    //   width: '50%',
    //   panelClass: 'reject-post',
    //   data: { name: "hello", animal: this.animal, profaneCategories: ['NSFW Image', 'Gore Image', 'Violent Image', 'Correct India Map', 'Incorrect India Map', 'Other'], id: id, text: text, profaneString: profaneString },

    // })

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   console.log('The dialog was closed', result)
    //   this.animal = result
    // })
  }

}

// @Component({
//   selector: 'discussion-popup-image.component',
//   templateUrl: 'discussion-popup-image.component.html',
//   styleUrls: ['./discussion-post.component.scss'],
// })
// export class DialogOverviewExampleDialogImage {
//   constructor(
//     public dialogRef: MatDialogRef<DialogOverviewExampleDialogImage>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData,
//   ) { }
//   imageChangedEvent: any = '';
//   croppedImage: any = '';

//   fileChangeEvent(event: any): void {
//     this.imageChangedEvent = event
//   }
//   imageCropped(event: ImageCroppedEvent) {
//     this.croppedImage = event.base64
//   }

//   cropperReady() {
//     // cropper ready
//   }
//   loadImageFailed() {
//     // show message
//   }
//   onNoClick(): void {
//     this.dialogRef.close()
//   }
// }
