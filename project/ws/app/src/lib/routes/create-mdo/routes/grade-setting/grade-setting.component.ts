import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'ws-app-grade-setting',
  templateUrl: './grade-setting.component.html',
  styleUrls: ['./grade-setting.component.scss']
})
export class GradeSettingComponent implements OnInit {
  settingsForm!: FormGroup
  groupGradeValue: string = ''
  groupGradeOtherValue: string = ''
  gradeList = [
    {
      value: 'grade_1',
      label: 'Grade I'
    },
    {
      value: 'grade_2',
      label: 'Grade II'
    },
    {
      value: 'grade_3',
      label: 'Grade III'
    },
    {
      value: 'grade_4',
      label: 'Grade IV'
    }
  ]
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.settingsForm = this.formBuilder.group({
      group_grade: [''],
      group_grade_other: [''],
    })
  }

  onGradeGroupChange(event: any): void {
    this.groupGradeValue = event.value

  }
  onOtherChange(event: any): void {
    this.groupGradeOtherValue = event.value

  }
}
