import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CardModel } from '../../models/CardModel';

@Component({
  selector: 'card-component',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './card-component.component.html',
  styleUrls: ['./card-component.component.scss']
})
export class CardComponentComponent implements OnInit {
  @Input() cardData: CardModel = new CardModel();
  constructor() { }

  ngOnInit(): void {
  }

}
