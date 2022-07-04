import { Component, OnInit } from '@angular/core';
import { ValidjsonService } from '../services/validjson.service';

@Component({
  selector: 'tool-menu',
  templateUrl: './tool-menu.component.html',
  styleUrls: ['./tool-menu.component.scss']
})
export class ToolMenuComponent implements OnInit {

  constructor(public isValidService: ValidjsonService) { }

  public validJson: boolean = false;

  ngOnInit(): void {
    this.isValidService.isValid.subscribe((value) => { this.validJson = value; })

  }
  ngOnDestroy(): void {
    this.isValidService.isValid.unsubscribe();
  }
}
