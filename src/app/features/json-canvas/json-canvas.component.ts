import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SVG, Element as SVGElement, Svg } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import { JsonMapperModel } from 'src/app/shared/models/JsonMapperModel';
import { ParserService } from 'src/app/shared/services/parserService/parser.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { Box } from '@svgdotjs/svg.js';
import { Text } from '@svgdotjs/svg.js';
import { Rect } from '@svgdotjs/svg.js';
import { LegendDialog } from 'src/app/shared/dialogs/legend-dialog';
import { MatDialog } from '@angular/material/dialog';
import {KeyTextStrategy} from "./strategies/keyTextStrategy";
import {JsonItemDrawingStrategy} from "../../shared/interfaces/jsonItemDrawingStrategy";
import {KeyLinkStrategy} from "./strategies/keyLinkStrategy";
import {ValueTextStrategy} from "./strategies/valueTextStrategy";
import {ValueNumberStrategy} from "./strategies/valueNumberStrategy";
import {ArrayStartStrategy} from "./strategies/arrayStartStrategy";
import {ArrayEndStrategy} from "./strategies/arrayEndStrategy";
import {ObjectStartStrategy} from "./strategies/objectStartStrategy";
import {ObjectEndStrategy} from "./strategies/objectEndStrategy";

@Component({
  selector: 'json-canvas',
  templateUrl: './json-canvas.component.html',
  styleUrls: ['./json-canvas.component.scss']
})
export class JsonCanvasComponent implements OnInit, OnDestroy, AfterViewInit {

  destroyed = new Subject<void>();
  public isMobile = false;
  public isShowing: boolean = false;
  public fileTitle: string = '';
  public toggleButton = true;

  constructor(public parserService: ParserService,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    private cdRef: ChangeDetectorRef
    ) {
    this.json = this.parserService.jsonModel;
    this.fileTitle = this.parserService.fileTitle;
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.matches) {
           this.isMobile = true;
           this.isShowing = false;
          }
          else{this.isShowing = true;}
        }
      });
  }
  ngAfterViewInit(): void {
    this.convertJsonToSVG()
    this.cdRef.detectChanges();
  }

  public json: JsonMapperModel[] = [];
  public canvas: Svg = new Svg();
  public heightAndWidthForValueTracker: Array<{ x: number, y: number }> = [];

  /** this will mark the horizontal axis in regard to the canvas */
  public xAxis: number = 50;
  /** this will mark the vertical axis in regard to the canvas */
  public yAxis: number = 40;
  public arrayIndex = 0;
  //initialise array to track the start and end of objects
  public objectXaxisTracker: Array<{ x: number, y: number, x2: number, y2: number, startIndex: number, endIndex: number }> = new Array<{ x: number, y: number, x2: number, y2: number, startIndex: number, endIndex: number }>();

  ngOnInit(): void {
    this.toggleButton = false;
    this.canvas = SVG().addTo('#canvas').size('100%', '100%');
    this.toggleButton = true;
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }


  public reloadCanvas() {
    this.canvas.clear();
    this.xAxis = 50;
    this.yAxis = 40;
    this.heightAndWidthForValueTracker = [];
    this.convertJsonToSVG()

  }

  public changeCoordinates(isInArray: boolean) {
    if(isInArray) {
      this.yAxis = this.yAxis + 50;
      return;
    }
    this.xAxis = this.xAxis + 100;
  }

  public convertJsonToSVG() {
    let startObjectIndent = false;
    let isInArray = false;

    for (let item of this.json) {
      const strategy = this.selectStrategy(item);
      strategy.execute(item, this, isInArray, startObjectIndent);

      // Update the state variables based on the current item
      if (item.Array === 'start') {
        isInArray = true;
      } else if (item.Array === 'end') {
        isInArray = false;
      }

      startObjectIndent = true;
      this.arrayIndex++;
    }
  }

  private selectStrategy(item: JsonMapperModel): JsonItemDrawingStrategy {
    if (item.Key && item.Text) return new KeyTextStrategy();
    if (!item.Key && item.Text) return new ValueTextStrategy();
    if (!item.Key && item.Number) return new ValueNumberStrategy();
    if (item.KeyLink) return new KeyLinkStrategy();
    if (item.Array === 'start') return new ArrayStartStrategy();
    if (item.Array === 'end') return new ArrayEndStrategy();
    if (item.Object === 'start') return new ObjectStartStrategy();
    if (item.Object === 'end') return new ObjectEndStrategy();

    throw new Error('Unsupported item type');
  }

  public adjustBbox(x: { x: number; y: number; x2: number; y2: number; startIndex: number; endIndex: number }, context: JsonCanvasComponent) {
    x.endIndex = context.arrayIndex;

    let val = SVG('#value' + (context.arrayIndex - 1));
    if (val) {
      let valBbox = val.bbox()
      x.x2 = valBbox.x2
      x.y2 = valBbox.y2
    }
    let numVal = SVG('#valueNumber' + (context.arrayIndex - 1));
    if (numVal) {
      let valBbox = numVal.bbox()
      x.x2 = valBbox.x2
      x.y2 = valBbox.y2
    }
    return {val, numVal};
  }

  public wrapInSVGPath(context: JsonCanvasComponent, x: { x: number; y: number; x2: number; y2: number; startIndex: number; endIndex: number }) {
    let previousObject = SVG('#path' + (context.arrayIndex - 1));
    x.x2 = previousObject.bbox().x2;
    x.y2 = previousObject.bbox().y2;

    let previousSymbol = SVG('#symbolGroup' + context.arrayIndex);
    previousSymbol.x(previousObject.bbox().x2 + 30)
  }

  public addSvgKeyToCanvas(value: string, int: number) {
    let text = this.canvas.text(value).id('key' + int)
    this.setTextProperties(text, 'key');
    let background = SVG('#key' + int);
    if (background) {
      const boxSize = background.bbox();
      const xaxis = boxSize.width;
      const yaxis = boxSize.height * 2;
      const squareKey = this.canvas.rect(10, 10).fill('#faf0e6').y(this.yAxis - 7).x(this.xAxis - 7).radius(10).stroke('#000').id('rectKey' + int);
      squareKey.height(yaxis).width(xaxis + 20);
      text.front()
      let keyGroup = this.canvas.group().id('keyGroup' + int);
      keyGroup.add(squareKey);
      keyGroup.add(text);
    }
  }

  public addSvgValueToCanvas(value: string, int: number) {
    let text = this.canvas.text(value).id('value' + int)
    this.setTextProperties(text, 'value');
    let background = SVG('#value' + int);
    if (background) {
      const { squareValue, boxSize } = this.createSvgBoxAroundValue(background, int, text, '#dee8f2');
      this.groupSvg(int, squareValue, text);
      this.heightAndWidthForValueTracker.push({ x: boxSize.x2 + 50, y: boxSize.y });
      this.createSvgLineToKey(int, boxSize);
    }
  }

  public addSvgValueNumberToCanvas(value: number, int: number) {
    let text = this.canvas.text(value.toString()).id('valueNumber' + int)
    this.setTextProperties(text, 'valueNumber');
    let background = SVG('#valueNumber' + int);
    if (background) {
      const { squareValue, boxSize } = this.createSvgBoxAroundValue(background, int, text, '#C1E1C1');
      this.groupSvg(int, squareValue, text);
      this.createSvgLineToKey(int, boxSize);
    }
  }

  private createSvgBoxAroundValue(background: SVGElement, int: number, text: Text, color: string) {
    const boxSize = background.bbox();
    let xaxis = boxSize.width;
    let yaxis = boxSize.height * 2;
    const squareValue = this.canvas.rect(10, 10).fill(color).y(this.yAxis - 7).x(this.xAxis - 7).radius(10).stroke('#000').id('rectValue' + int);
    squareValue.height(yaxis).width(xaxis + 20);
    text.front();
    return { squareValue, boxSize };
  }

  private setTextProperties(text: Text, className: string) {
    text.node.setAttribute('class', className);
    text.font({ fill: '#000', family: 'Inconsolata' }).y(this.yAxis).x(this.xAxis);
  }

  private groupSvg(int: number, squareValue: Rect, text: Text) {
    let valueGroup = this.canvas.group().id('valueGroup' + int);
    valueGroup.add(squareValue);
    valueGroup.add(text);
  }

  private createSvgLineToKey(int: number, boxSize: Box) {
    let line = SVG('#colon' + (int - 1));
    if (line) {
      line.attr('x2', boxSize.x);
    }
  }

  public createColonSvgLink(int: number) {
    let kSVG = SVG('#key' + (int - 1));
    let line = this.canvas.line(kSVG.bbox().x2, this.yAxis + 5, kSVG.bbox().x2 + 70, this.yAxis + 5).id('colon' + int);
    line.stroke({ color: '#004442', width: 3, linecap: 'round' })
    line.back();
  }

  public createPathForWrappingObject(pathData: { x: number, y: number, x2: number, y2: number}, color: string) {
    let path = this.canvas.path(
      `
      M ${pathData.x} ${pathData.y}
      H ${pathData.x2 + 50}
      V ${pathData.y2 + 50}
      H ${pathData.x}
      Z
      `
    ).fill({ color: color }).id('path' + this.arrayIndex).opacity(0.3);
    path.back();
  }

  /**
   * Creates a symbol either an array or object
   */
  public createSymbol(symbol: string, int: number, symbolType: string) {
    let text = this.canvas.text(symbol).id(symbolType + int)
    text.font({ fill: '#fff', family: 'Inconsolata', size: 28 }).y(this.yAxis - 15).x(this.xAxis);
    let background = SVG('#'+ symbolType + int);
    if (background) {
      const circleSymbol = this.canvas.circle(40, 40).fill('#000').cy(this.yAxis).cx(this.xAxis + 5).id('circle' + int);
      let symbolGroup = this.canvas.group().id('symbolGroup' + int);
      symbolGroup.add(circleSymbol);
      symbolGroup.add(text);
    }
  }

  public toggleSideNave(drawer: MatSidenav) {
    drawer.toggle();
  }

  public viewLegend() {
    const dialogRef = this.dialog.open(LegendDialog, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      result;
    });
  }
}
