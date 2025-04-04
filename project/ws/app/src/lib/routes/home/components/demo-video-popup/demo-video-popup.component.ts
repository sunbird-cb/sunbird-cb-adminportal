import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'ws-app-demo-video-popup',
  templateUrl: './demo-video-popup.component.html',
  styleUrls: ['./demo-video-popup.component.scss'],
})
export class DemoVideoPopupComponent implements OnInit {
  videoLink = ''

  constructor(
    public dialogRef: MatDialogRef<DemoVideoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private domSanitizer: DomSanitizer
  ) {
    this.videoLink = this.dialogData.videoLink
  }

  ngOnInit() {
  }

  get getVideoLink() {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.videoLink)
  }

}
