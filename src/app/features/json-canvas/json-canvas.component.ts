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
  // tring to get these to work now 
  // to allow cascade of svgs on canvas

  /** this will mark the horizontal axis in regards to the canvas */
  public xAxis: number = 50;
  /** this will mark the verticle axis in regards to the canvas */
  public yAxis: number = 40;

  ngOnInit(): void {
    this.loadCanvas();

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
        this.xAxis = this.xAxis - 25;
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
        this.yAxis = this.yAxis + 50;
        let x =  objectXaxisTracker.pop();
        this.xAxis = x ? x : this.xAxis;
        this.createSymbolSvgLink('}', arrayIndex);
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
      const squareKey = this.canvas.rect(10, 10).fill('#faf0e6').y(this.yAxis-7).x(this.xAxis-7).radius(10).stroke('#000');
      squareKey.height(yaxis).width(xaxis + 20);
      text.front()
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
      const squareValue = this.canvas.rect(10, 10).fill('#dee8f2').y(this.yAxis-7).x(this.xAxis-7).radius(10).stroke('#000');
      squareValue.height(yaxis).width(xaxis + 20);
      text.front()
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
      const circleSymbol = this.canvas.circle(40, 40).fill('#000').cy(this.yAxis ).cx(this.xAxis + 5);
      text.front();
      let line = SVG('#colon' + (int - 1));
      if (line) {
        line.attr('x2', boxSize.x);
      }      
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

}
