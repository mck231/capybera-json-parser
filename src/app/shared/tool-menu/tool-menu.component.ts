import { Component, OnInit } from '@angular/core';
import { ValidjsonService } from '../services/validjson.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputJsonDialog } from '../dialogs/input-json-dialog';
import { Subscription } from 'rxjs';
import { PreviewJsonDialog } from '../dialogs/json-preview-dialog';

@Component({
  selector: 'tool-menu',
  templateUrl: './tool-menu.component.html',
  styleUrls: ['./tool-menu.component.scss']
})
export class ToolMenuComponent implements OnInit {

  constructor(public isValidService: ValidjsonService, public dialog: MatDialog) { }

  public validJson: boolean = false;
  public sub: Subscription | undefined;

  ngOnInit(): void {
    this.sub = this.isValidService.isValid.subscribe((value) => { this.validJson = value; })

  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  public enterNewJson() {
    const dialogRef = this.dialog.open(InputJsonDialog, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      result;
    });
  }

  public viewJson() {
    // call the parser service and throw into something
    const dialogRef = this.dialog.open(PreviewJsonDialog, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      result;
    });
  }
}
