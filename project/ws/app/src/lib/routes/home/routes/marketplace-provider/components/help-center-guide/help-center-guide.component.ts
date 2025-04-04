import { Component, Input, OnInit } from '@angular/core'
import { environment } from '../../../../../../../../../../../src/environments/environment'
import * as _ from 'lodash'
import { DemoVideoPopupComponent } from '../../../../components/demo-video-popup/demo-video-popup.component'
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'ws-app-help-center-guide',
  templateUrl: './help-center-guide.component.html',
  styleUrls: ['./help-center-guide.component.scss'],
})
export class HelpCenterGuideComponent implements OnInit {

  @Input() helpCenterGuide: any

  showTopSection = false
  playVideo = false

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openVideoPopup() {
    const url = `${environment.karmYogiPath}${_.get(this.helpCenterGuide, 'helpVideoLink')}`
    this.dialog.open(DemoVideoPopupComponent, {
      data: {
        videoLink: url,
      },
      disableClose: true,
      width: '50%',
      height: '60%',
      panelClass: 'overflow-visable',
    })
  }

  callResizeEvent(_event: any) {
    if (document.querySelector('.flex')) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      },         100)
    }
  }

}
