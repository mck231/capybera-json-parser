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

  ngOnInit(): void {
    this.loadCanvas();
    
  }
  public loadCanvas(){
    this.canvas = SVG().addTo('#canvas').size('1200px', '980px');
    this.convertJsonToSVG()
  }

  public convertJsonToSVG(){    
    for(let item of this.json){
      if(item.Key == true && item.Text){
          this.addSvgKeyToCanvas(item.Text)
      }
      if(item.Key == false && item.Text){
        this.addSvgValueToCanvas(item.Text)
      }
      if(item.KeyLink == true){
        this.createColonSvgLink()
      }
      
    }
  }

  public addSvgKeyToCanvas(value: string) {
    let text = this.canvas.text(value).id('key1')
    text.font({ fill: '#000', family: 'Inconsolata' }).y(40).x(50);
    let background = SVG('#key1');
    if (background) {
      const boxSize = background.bbox();
      const xaxis = boxSize.width;
      const yaxis = boxSize.height * 2;
      const squareKey = this.canvas.rect(10, 10).fill('#faf0e6').y(30).x(40).radius(10).stroke('#000');
      squareKey.height(yaxis).width(xaxis + 20);
      console.warn(squareKey.bbox())
      text.front()
    }
  }

  public addSvgValueToCanvas(value: string) {
    let text = this.canvas.text(value).id('value1')
    text.font({ fill: '#000', family: 'Inconsolata' }).y(40).x(200);
    let background = SVG('#value1');
    if (background) {
      const boxSize = background.bbox();
      let xaxis = boxSize.width;
      let yaxis = boxSize.height * 2;
      const squareValue = this.canvas.rect(10, 10).fill('#dee8f2').y(30).x(190).radius(10).stroke('#000');
      squareValue.height(yaxis).width(xaxis + 20);
      console.warn(squareValue.bbox())
      text.front()
      let line = SVG('#colon1');
      line.attr('x2', boxSize.x);
    }
  }

  public addSvgObjectToCanvas() {
    // let text = this.canvas.text('Hello World').id('key1')
    // text.font({ fill: '#000', family: 'Inconsolata' }).y(40).x(50);
    // let background = SVG('#key1');
    // if (background) {
    //   const boxSize = background.bbox();
    //   const xaxis = boxSize.width;
    //   const yaxis = boxSize.height * 2;
    //   const squareKey = this.canvas.rect(10, 10).fill('#faf0e6').y(30).x(40).radius(10).stroke('#000');
    //   squareKey.height(yaxis).width(xaxis + 20);
    //   console.warn(squareKey.bbox())
    //   text.front()
    // }
  }

  public createColonSvgLink(){
    let kSVG = SVG('#key1');
    let line = this.canvas.line(kSVG.bbox().x2, 50, 0, 50).id('colon1');
    line.stroke({ color: '#000', width: 3, linecap: 'round' })
    line.back();
    // Need to refactor code to use BBox
    //document.querySelector("#value1").children[0].getBBox()

  }

}
