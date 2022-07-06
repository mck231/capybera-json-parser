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
  constructor(public parserService: ParserService) { }

  public json: any;
  public canvas: Svg = new Svg();

  ngOnInit(): void {
    this.loadCanvas();
    this.json = this.parserService.jsonModel;
    console.table(this.json);
  }
  public loadCanvas(){
    this.canvas = SVG().addTo('#canvas').size('1200px', '1200px');
    this.drawKey()
  }

  public drawKey() {
    var rect = this.canvas.rect(100, 100).fill('#f06').move(20, 20)
    var text = this.canvas.text(function(add) {
      add.tspan('We go ')
      add.tspan('up').fill('#f09').dy(-40)
      add.tspan(', then we go down, then up again').dy(40)
    })
    
    var path = 'M 100 200 C 200 100 300 0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100'
    
    var textpath = text.path(path).font({ size: 42.5, family: 'Verdana' })
  }
   
}
