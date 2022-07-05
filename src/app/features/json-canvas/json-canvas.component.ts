import { Component, Input, OnInit } from '@angular/core';
import { SVG, extend as SVGextend, Element as SVGElement } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import { JsonMapperModel } from 'src/app/shared/models/JsonMapperModel';
import { ValidjsonService } from 'src/app/shared/services/validjson.service';

@Component({
  selector: 'json-canvas',
  templateUrl: './json-canvas.component.html',
  styleUrls: ['./json-canvas.component.scss']
})
export class JsonCanvasComponent implements OnInit {
  @Input() public fileContent: string = '';
  @Input() public validJson: boolean = false;
  
  constructor(public isValid: ValidjsonService) { }

  ngOnInit(): void {
    this.loadCanvas();
  }
  public loadCanvas(){
    var draw = SVG().addTo('#canvas').size('100%', '100%')
    var rect = draw.rect(100, 100).attr({ fill: '#f06' })
    rect.draggable()
  }
 


  
}
