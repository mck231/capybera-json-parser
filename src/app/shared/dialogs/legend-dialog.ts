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
    <li><span style='background:#8DD3C7;'></span>Values that are Strings</li>
    <li><span style='background:#C1E1C1;'></span>Two</li>
    <li><span style='background:#BEBADA;'></span>Three</li>
    <li><span style='background:#FB8072;'></span>Four</li>
    <li><span style='background:#80B1D3;'></span>etc</li>
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