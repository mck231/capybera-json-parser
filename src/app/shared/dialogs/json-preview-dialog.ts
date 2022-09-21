import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { ParserService } from "../services/parserService/parser.service";
import { ValidjsonService } from "../services/validjson.service";

@Component({
    selector: 'dialog-json-preview-dialog',
  template: `
  <h1 mat-dialog-title>JSON Preview</h1>
  <div mat-dialog-content>
      <p>content here</p>
  </div>
  <div mat-dialog-actions>
      <button mat-button (click)="close()"> OK </button>
  </div>
`,
  })
  export class PreviewJsonDialog {
    constructor(
      public dialogRef: MatDialogRef<PreviewJsonDialog>,
      public isValidService: ValidjsonService,
      public paserService: ParserService
    ) {}
  
    public close() {
        this.dialogRef.close()
    }
    
  }