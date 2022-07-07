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
    let x = 0;
    let y = 50
    for(let el of this.json){
      if(el && el.Text){
      this.canvas.text(el.Text).move(x, y).font({ size: 22, family: 'Verdana' });
      }
      x = x += 100;
    }
  }

  public drawKey() {
    var text = this.canvas.text(function(add) {
      add.tspan('We go ')
      add.tspan('up').fill('#f09').dy(-40)
      add.tspan(', then we go down, then up again').dy(40)
    })
    
    var path = 'M 100 200 C 200 100 300 0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100'
    
    var textpath = text.path(path).font({ size: 42.5, family: 'Verdana' })
  }

  
   
}
