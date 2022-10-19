import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ParserService } from "../services/parserService/parser.service";
import { ValidjsonService } from "../services/validjson.service";

@Component({
    selector: 'dialog-overview-example-dialog',
  template: `
  <h1 mat-dialog-title>Data will be lost</h1>
  <!-- <div mat-dialog-content>
      <p>Do you wish to continue?</p>      
  </div> -->
  <div mat-dialog-actions>
      <button mat-flat-button color="accent" (click)="dialogRef.close()"> Cancel </button>
      <button mat-flat-button (click)="onNoClick()" color="warn" cdkFocusInitial>Continue</button>
  </div>
`,
  })
  export class InputJsonDialog {
    constructor(
      public dialogRef: MatDialogRef<InputJsonDialog>,
      public isValidService: ValidjsonService,
      public paserService: ParserService
    ) {}
  
    onNoClick(): void {
      this.isValidService.changeIfValid(false);
      this.paserService.clearContent();
      this.dialogRef.close();
    }
  }