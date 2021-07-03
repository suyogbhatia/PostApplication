import { Component, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  templateUrl: './error.component.html'
})
export class ErrorComponent {
  message = 'An unknown Error';
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) { }

}
