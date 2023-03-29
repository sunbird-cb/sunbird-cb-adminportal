
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'

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

  constructor(private snackBar: MatSnackBar, private route: Router, private activatedRoute: ActivatedRoute) {
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
    console.log(this.positionForm.value)
    this.openSnackbar('success!')
    this.route.navigate(['active-positions'], { relativeTo: this.activatedRoute.parent })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}