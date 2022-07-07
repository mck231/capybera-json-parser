import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'dialog-overview-example-dialog',
  template: `
    <h1 mat-dialog-title>Input New Data</h1>
<div mat-dialog-content>
    <p>What's your favorite animal?</p>
    
</div>
<div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">No Thanks</button>
    <button mat-button  cdkFocusInitial>Ok</button>
</div>
`,
  })
  export class InputJsonDialog {
    constructor(
      public dialogRef: MatDialogRef<InputJsonDialog>
      
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }