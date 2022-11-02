import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'legend-dialog',
    styles: [`  .my-legend .legend-title {
        text-align: left;
        margin-bottom: 5px;
        font-weight: bold;
        font-size: 90%;
        }
      .my-legend .legend-scale ul {
        margin: 0;
        margin-bottom: 5px;
        padding: 0;
        float: left;
        list-style: none;
        }
      .my-legend .legend-scale ul li {
        font-size: 80%;
        list-style: none;
        margin-left: 0;
        line-height: 18px;
        margin-bottom: 2px;
        }
      .my-legend ul.legend-labels li span {
        display: block;
        float: left;
        height: 16px;
        width: 30px;
        margin-right: 5px;
        margin-left: 0;
        border: 1px solid #999;
        }
      .my-legend .legend-source {
        font-size: 70%;
        color: #999;
        clear: both;
        }
      .my-legend a {
        color: #777;
        }`],
    template: `
  <h1 mat-dialog-title>Legend</h1>
  <div mat-dialog-content>
  <div class='legend-scale'>
  <div class='my-legend'>
<div class='legend-scale'>
  <ul class='legend-labels'>
    <li><span style='background:#faf0e6;'></span>Represents key</li>
    <li><span style='background:#dee8f2;'></span>Represents values that are Strings</li>
    <li><span style='background:#c1e1c1;'></span>Represents values that are Numbers</li>
    <li><span style='background:#fb94b5;'></span>Represents an Array of values</li>
    <li><span style='background:#d2b48c;'></span>Represents an Object with a key and value</li>
  </ul>
</div>
</div>
</div>
  </div>
  <div mat-dialog-actions>
      <button mat-flat-button color="primary" (click)="close()"> OK </button>
  </div>
`,
})
export class LegendDialog {
    constructor(
        public dialogRef: MatDialogRef<LegendDialog>
    ) { }

    public close() {
        this.dialogRef.close()
    }

}