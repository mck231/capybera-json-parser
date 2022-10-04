import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SVG, extend as SVGextend, Element as SVGElement, Svg } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import { JsonMapperModel } from 'src/app/shared/models/JsonMapperModel';
import { ValidjsonService } from 'src/app/shared/services/validjson.service';
import { ParserService } from 'src/app/shared/services/parserService/parser.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

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

  constructor(public parserService: ParserService, public breakpointObserver: BreakpointObserver) {
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
    this.loadCanvas();
  }

  public json: JsonMapperModel[] = [];
  public canvas: Svg = new Svg();
  public heightAndWidthForValueTracker: Array<{ x: number, y: number }> = [];

  /** this will mark the horizontal axis in regards to the canvas */
  public xAxis: number = 50;
  /** this will mark the verticle axis in regards to the canvas */
  public yAxis: number = 40;
  //initialise array to track the start and end of objects
  public objectXaxisTracker: Array<{ x: number, y: number, x2: number, y2: number, startIndex: number, endIndex: number }> = new Array<{ x: number, y: number, x2: number, y2: number, startIndex: number, endIndex: number }>();

  ngOnInit(): void {
    this.toggleButton = false;
    this.canvas = SVG().addTo('#canvas').size('1200px', '1800px');
    this.toggleButton = true;
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();  
  }

  
  public realoadCavnas() {
    this.canvas.clear();
    this.xAxis = 50;
    this.yAxis = 40;
    this.heightAndWidthForValueTracker = [];
    this.convertJsonToSVG()

  }
  public loadCanvas() {
    this.convertJsonToSVG()
  }

  public convertJsonToSVG() {
    let startOjbectIndent = false;
    let arrayIndex = 0;
    for (let item of this.json) {
      if (item.Key == true && item.Text) {
        if (startOjbectIndent == true) {
          this.yAxis = this.yAxis + 50;
          this.xAxis = this.xAxis + 50;
          this.addSvgKeyToCanvas(item.Text, arrayIndex)
        }
        this.addSvgKeyToCanvas(item.Text, arrayIndex)
      }
      else if (item.Key == false && item.Text) {
        this.xAxis = this.xAxis + 100;
        this.addSvgValueToCanvas(item.Text, arrayIndex)
      }
      else if (item.Key == false && item.Number) {
        this.yAxis = this.yAxis + 50;
        this.addSvgValueNumberToCanvas(item.Number, arrayIndex)
      }
      else if (item.KeyLink == true) {
        this.createColonSvgLink(arrayIndex)
      }
      else if (item.Array == 'start') {
        this.createArraySymbol('[', arrayIndex);
        this.xAxis = this.xAxis + 50;
      }
      else if (item.Array == 'end') {
        this.yAxis = this.yAxis + 50;
        this.xAxis = this.xAxis - 50;
        this.createArraySymbol(']', arrayIndex)
      }
      else if (item.Object == 'start') {
        this.xAxis = this.xAxis + 100;
        this.createSymbolSvgLink('{', arrayIndex);
        if (this.xAxis && arrayIndex) {
          let objStartAndEnd = { x: this.xAxis, y: this.yAxis, x2: 0, y2: 0, startIndex: arrayIndex, endIndex: 0 };
          this.objectXaxisTracker.push(objStartAndEnd);
        }
      }
      else if (item.Object == 'end') {
        let x = this.objectXaxisTracker.pop();
        this.xAxis = this.heightAndWidthForValueTracker[0].x
        this.createSymbolSvgLink('}', arrayIndex);
        if (x) {
          // move down complimentary symbol group
          let complimentarySymbolGroup = SVG('#symbolGroup' + x.startIndex);
          complimentarySymbolGroup.y(this.yAxis - 15)
          
          x.endIndex = arrayIndex;
          
          let val = SVG('#value' + (arrayIndex - 1));
          if (val) {
            let valBbox = val.bbox()
            x.x2 = valBbox.x2
            x.y2 = valBbox.y2
          }
          if(!val) {
            // found path for wrapping object
            let previousObject = SVG('#path' + (arrayIndex - 1));
            x.x2 = previousObject.bbox().x2;
            x.y2 = previousObject.bbox().y2;
            
            let previousSymbol = SVG('#symbolGroup' + arrayIndex);
            previousSymbol.x(previousObject.bbox().x2 + 30)

            
            //previousSymbol.x = 
            //previousObject.x

          }
          arrayIndex++;
          this.createPathForWrappingObject(arrayIndex, x);
        }
      }
      startOjbectIndent = true;
      arrayIndex++;
    }
  }

  public extractHighestXaxisOfValueInObject(lowerBound: number, upperBound: number) {
    //query canvas for values between start and end index
    // search for dom all values that start with vlaue    
    let values = SVG('.value');
    // for(let val of values){

    // }
    //console.warn(values)
    return values.bbox().x2;
  }
  public extractHighestYaxisOfValueInObject(lowerBound: number, upperBound: number) {
    //query canvas for values between start and end index
    // search for dom all values that start with vlaue
    let values = this.canvas.find('.key');
    //console.table(values)
    return values
  }

  public addSvgKeyToCanvas(value: string, int: number) {
    let text = this.canvas.text(value).id('key' + int)
    text.node.setAttribute('class', 'key');
    text.font({ fill: '#000', family: 'Inconsolata' }).y(this.yAxis).x(this.xAxis);
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
    text.node.setAttribute('class', 'value');
    text.font({ fill: '#000', family: 'Inconsolata' }).y(this.yAxis).x(this.xAxis);
    let background = SVG('#value' + int);
    if (background) {
      const boxSize = background.bbox();
      let xaxis = boxSize.width;
      let yaxis = boxSize.height * 2;
      const squareValue = this.canvas.rect(10, 10).fill('#dee8f2').y(this.yAxis - 7).x(this.xAxis - 7).radius(10).stroke('#000').id('rectValue' + int);
      squareValue.height(yaxis).width(xaxis + 20);
      text.front()

      let valueGroup = this.canvas.group().id('valueGroup' + int);
      valueGroup.add(squareValue);
      valueGroup.add(text);
      this.heightAndWidthForValueTracker.push({ x: boxSize.x2 + 50, y: boxSize.y });
      let line = SVG('#colon' + (int - 1));
      if (line) {
        line.attr('x2', boxSize.x);
      }
    }
  }

  public addSvgValueNumberToCanvas(value: number, int: number) {
    let text = this.canvas.text(value.toString()).id('valueNumber' + int)
    text.node.setAttribute('class', 'valueNumber');
    text.font({ fill: '#000', family: 'Inconsolata' }).y(this.yAxis).x(this.xAxis);
    let background = SVG('#valueNumber' + int);
    if (background) {
      const boxSize = background.bbox();
      let xaxis = boxSize.width;
      let yaxis = boxSize.height * 2;
      const squareValue = this.canvas.rect(10, 10).fill('#C1E1C1').y(this.yAxis - 7).x(this.xAxis - 7).radius(10).stroke('#000').id('rectValue' + int);
      squareValue.height(yaxis).width(xaxis + 20);
      text.front()
      let valueGroup = this.canvas.group().id('valueGroup' + int);
      valueGroup.add(squareValue);
      valueGroup.add(text);
    }
  }


  public createSymbolSvgLink(symbol: string, int: number) {
    let text = this.canvas.text(symbol).id('symbol' + int)
    text.font({ fill: '#fff', family: 'Inconsolata', size: 28 }).y(this.yAxis - 15).x(this.xAxis);
    let background = SVG('#symbol' + int);
    if (background) {
      //const boxSize = background.bbox();
      const circleSymbol = this.canvas.circle(40, 40).fill('#000').cy(this.yAxis).cx(this.xAxis + 5).id('circle' + int);
      text.front();
      // let line = SVG('#colon' + (int - 1));
      // if (line) {
      //   line.attr('x2', boxSize.x);
      // }      

      let symbolGroup = this.canvas.group().id('symbolGroup' + int);
      symbolGroup.add(circleSymbol);
      symbolGroup.add(text);
    }
  }

  public createColonSvgLink(int: number) {
    let kSVG = SVG('#key' + (int - 1));
    let line = this.canvas.line(kSVG.bbox().x2, this.yAxis + 5, kSVG.bbox().x2 + 70, this.yAxis + 5).id('colon' + int);
    line.stroke({ color: '#000', width: 3, linecap: 'round' })
    line.back();
    // Need to refactor code to use BBox
    //document.querySelector("#value1").children[0].getBBox()

  }

  public createPathForWrappingObject(int: number, pathData: { x: number, y: number, x2: number, y2: number, startIndex: number, endIndex: number }) {
    // for future reference
    // https://www.w3.org/TR/SVG/paths.html
    let path = this.canvas.path(
      `
      M ${pathData.x} ${pathData.y} 
      H ${pathData.x2 + 50} 
      V ${pathData.y2 + 50} 
      H ${pathData.x} 
      Z
      `
    ).fill({ color: '#D2B48C' }).id('path' + int).opacity(0.3);
    path.back();
  }

  /**
   * createArraySymbol
   */
  public createArraySymbol(symbol: string, int: number) {
    let text = this.canvas.text(symbol).id('array' + int)
    text.font({ fill: '#fff', family: 'Inconsolata', size: 28 }).y(this.yAxis - 15).x(this.xAxis);
    let background = SVG('#array' + int);
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
}