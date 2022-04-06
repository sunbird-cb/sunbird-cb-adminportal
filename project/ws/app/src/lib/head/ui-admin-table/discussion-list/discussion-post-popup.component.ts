import {
  Component,
  Inject,
  OnInit,
} from '@angular/core'

import * as _ from 'lodash'

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { MatChipInputEvent } from '@angular/material/chips'
import { FormBuilder, FormGroup } from '@angular/forms'

export interface IDialogData {
  profaneCategories: string[]
  text: any
  id: any
  profaneString: any
}

@Component({
  selector: 'discussion-popup.component',
  templateUrl: 'discussion-popup.component.html',
  styleUrls: ['./discussion-post.component.scss'],
})




export class DialogTextProfanityComponent implements OnInit {
  profane_group: FormGroup


  constructor(fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogTextProfanityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
  ) {


    var temp: any = {}
    for (let i = 0; i < data.profaneCategories.length; i++) {

      temp[data.profaneCategories[i]] = false

    }

    this.profane_group = fb.group(temp)
  }

  visible = true
  selectable = true
  removable = true
  comment: any

  /*set the separator keys.*/

  readonly separatorKeysCodes: number[] = [ENTER, COMMA]

  /*create the tags list.*/

  TAGS: string[] = []

  ngOnInit() {

    if (this.data.profaneString !== null && this.data.profaneString !== '' && this.data.profaneString !== []) {
      this.TAGS.push(...this.data.profaneString)
    }

  }
  /*our custom add method which will take
      matChipInputTokenEnd event as input.*/
  add(event: MatChipInputEvent): void {

    /*we will store the input and value in local variables.*/

    const input = event.input
    const value = event.value

    if ((value || '').trim()) {

      /*the input string will be pushed to the tag list.*/

      this.TAGS.push(value)
      // console.log(this.TAGS)

    }

    if (input) {

      /*after storing the input we will clear the input field.*/

      input.value = ''
    }
  }

  /*custom method to remove a tag.*/

  remove(tag: string): void {
    const index = this.TAGS.indexOf(tag)

    if (index >= 0) {

      /*the tag of a particular index is removed from the tag list.*/

      this.TAGS.splice(index, 1)
    }
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
}
