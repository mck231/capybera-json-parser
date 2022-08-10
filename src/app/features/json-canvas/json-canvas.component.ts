import { Component, Input, OnInit } from '@angular/core';
import { SVG, extend as SVGextend, Element as SVGElement, Svg } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import { JsonMapperModel } from 'src/app/shared/models/JsonMapperModel';
import { ValidjsonService } from 'src/app/shared/services/validjson.service';
import { ParserService } from 'src/app/shared/services/parserService/parser.service';

@Component({
  selector: 'json-canvas',
  templateUrl: './json-canvas.component.html',
  styleUrls: ['./json-canvas.component.scss']
})
export class JsonCanvasComponent implements OnInit {
  constructor(public parserService: ParserService) {
    this.json = this.parserService.jsonModel;
  }

  public json: JsonMapperModel[] = [];
  public canvas: Svg = new Svg();
  public heightAndWidthForValueTracker: Array<{ x: number, y: number }> = [];

  /** this will mark the horizontal axis in regards to the canvas */
  public xAxis: number = 50;
  /** this will mark the verticle axis in regards to the canvas */
  public yAxis: number = 40;

  ngOnInit(): void {
    this.loadCanvas();
  }
  public realoadCavnas() {
    this.canvas.clear();
    this.xAxis = 50;
    this.yAxis = 40;
    this.heightAndWidthForValueTracker = [];
    this.convertJsonToSVG()

  }
  public loadCanvas() {
    this.canvas = SVG().addTo('#canvas').size('1200px', '800px');
    this.convertJsonToSVG()
  }

  public convertJsonToSVG() {
    let startOjbectIndent = false;
    let arrayIndex = 0;
    let objectXaxisTracker = [];
    for (let item of this.json) {
      if (item.Key == true && item.Text) {
        if(startOjbectIndent == true){
        this.yAxis = this.yAxis + 50;
        this.xAxis = this.xAxis + 50;
        this.addSvgKeyToCanvas(item.Text, arrayIndex)
        }
        this.addSvgKeyToCanvas(item.Text, arrayIndex)
       
      }
      if (item.Key == false && item.Text) {
        this.xAxis = this.xAxis + 100;
        this.addSvgValueToCanvas(item.Text, arrayIndex)
      }
      if (item.KeyLink == true) {
        this.createColonSvgLink(arrayIndex)
      }

      if (item.Object == 'start') {
        this.xAxis = this.xAxis + 100;
        objectXaxisTracker.push(this.xAxis);
        this.createSymbolSvgLink('{', arrayIndex);
      }
      if (item.Object == 'end') {
        //this.yAxis = this.yAxis + 50;
        let x =  objectXaxisTracker.pop();
        this.xAxis = this.heightAndWidthForValueTracker[0].x
        this.createSymbolSvgLink('}', arrayIndex);
        this.createPathForWrappingObject(arrayIndex);
      }
      startOjbectIndent = true;
      arrayIndex++;
    }
  }

  public addSvgKeyToCanvas(value: string, int: number) {
    let text = this.canvas.text(value).id('key'+ int)
    text.font({ fill: '#000', family: 'Inconsolata' }).y(this.yAxis).x(this.xAxis);
    let background = SVG('#key'+ int);
    if (background) {
      const boxSize = background.bbox();
      const xaxis = boxSize.width;
      const yaxis = boxSize.height * 2;
      const squareKey = this.canvas.rect(10, 10).fill('#faf0e6').y(this.yAxis-7).x(this.xAxis-7).radius(10).stroke('#000').id('rectKey' + int);
      squareKey.height(yaxis).width(xaxis + 20);
      text.front()

      let keyGroup = this.canvas.group().id('keyGroup' + int);
      keyGroup.add(squareKey);
      keyGroup.add(text);

    }
  }

  public addSvgValueToCanvas(value: string, int: number) {
    let text = this.canvas.text(value).id('value' + int)
    text.font({ fill: '#000', family: 'Inconsolata' }).y(this.yAxis).x(this.xAxis);
    let background = SVG('#value' + int);
    if (background) {
      const boxSize = background.bbox();
      let xaxis = boxSize.width;
      let yaxis = boxSize.height * 2;
      const squareValue = this.canvas.rect(10, 10).fill('#dee8f2').y(this.yAxis-7).x(this.xAxis-7).radius(10).stroke('#000').id('rectValue' + int);
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


  public createSymbolSvgLink(symbol: string, int: number) {
    let text = this.canvas.text(symbol).id('symbol' + int)
    text.font({ fill: '#fff', family: 'Inconsolata', size: 28}).y(this.yAxis - 15).x(this.xAxis);
    let background = SVG('#symbol' + int);
    if (background) {
      const boxSize = background.bbox();
      const circleSymbol = this.canvas.circle(40, 40).fill('#000').cy(this.yAxis ).cx(this.xAxis + 5 ).id('circle' + int);
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
    let line = this.canvas.line(kSVG.bbox().x2, this.yAxis+5, kSVG.bbox().x2, this.yAxis+5).id('colon' + int);
    line.stroke({ color: '#000', width: 3, linecap: 'round' })
    line.back();
    // Need to refactor code to use BBox
    //document.querySelector("#value1").children[0].getBBox()

  }

  public createPathForWrappingObject(int: number) { 
    // let path = this.canvas.path(
    //   `
    //   M10 10 
    //   L50 50
    //   L50 50 
    //   `
    //   ).fill('none').stroke({ color: '#000', width: 3, linecap: 'round' }).id('path' + int);

    //path.fill('none').move(20, 20).stroke({ width: 1, color: '#ccc' })

  }

}
