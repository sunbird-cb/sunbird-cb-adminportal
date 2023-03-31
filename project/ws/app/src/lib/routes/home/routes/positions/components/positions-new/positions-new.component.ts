
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { DialogConfirmComponent } from '../../../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'
import { PositionsService } from '../../services/position.service'

@Component({
  selector: 'ws-app-positions-new',
  templateUrl: './positions-new.component.html',
  styleUrls: ['./positions-new.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class PositionsNewComponent implements OnInit {
  positionForm!: FormGroup

  constructor(
    private snackBar: MatSnackBar,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private positionSvc: PositionsService,
    private dialogue: MatDialog
  ) {
    const currentState = this.route.getCurrentNavigation()
    let name, description, id = ''

    if (currentState && currentState.extras.state) {
      name = currentState.extras.state.row.name
      description = currentState.extras.state.row.description
      id = currentState.extras.state.row.id
    }
    this.positionForm = new FormGroup({
      name: new FormControl(name, [Validators.required, Validators.maxLength(500), Validators.pattern(/^[\w]+([-_\s]{1}[a-z0-9]+)*$/i)]),
      description: new FormControl(description, [Validators.required, Validators.maxLength(500), Validators.pattern(/^[\w]+([-_\s]{1}[a-z0-9]+)*$/i)]),
      id: new FormControl(id),
    })
  }
  ngOnInit(): void {

  }
  onSubmit() {
    const dialogRef = this.dialogue.open(DialogConfirmComponent, {
      data: {
        title: "Attention!!",
        bodyHTML: `Please click No if you are not sure about new position, otherwise click Yes
        <br />  Note: <strong>No further EDIT Or Delete will be allowed!</strong>`,
      }
    })

    dialogRef.afterClosed().subscribe((response: any) => {
      console.log(response)
      if (response) {
        console.log(this.positionForm.value)
        const data = {
          request: {
            contextType: 'position',
            contextData: this.positionForm.controls['description'].value,
            contextName: this.positionForm.controls['name'].value
          }
        }
        this.positionSvc.createNewPosition(data).subscribe(() => {
          this.openSnackbar('Success!')
          this.route.navigate(['active-positions'], { relativeTo: this.activatedRoute.parent })

        })
      } else {
        this.openSnackbar("Cancelled", 5000)
        this.positionForm.reset()
      }
    })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}