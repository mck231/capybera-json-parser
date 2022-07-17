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
      
    }
  }

  public addSvgKeyToCanvas(value: string) {
    // const squareKey = this.canvas.rect(100, 100).fill('#f06').move(10, 10).radius(10);

    let text = this.canvas.text(value).id('key1')
    text.font({ fill: '#fff', family: 'Inconsolata' }).dy(50).x(50);

    let background = SVG('#key1');
    if (background) {
      //let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      const xaxis = background.node.clientWidth
      const yaxis = background.node.clientHeight
      const squareKey = this.canvas.rect(+xaxis, +yaxis).fill('#h20').dy(50).x(50);
      squareKey.after(text);
    }

  }

}
