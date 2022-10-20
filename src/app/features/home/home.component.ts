import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CardModel } from 'src/app/shared/models/CardModel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public whyCard: CardModel = { Title: 'Why', Body: `Trying to read Json data shouldn't be distracting or dificult. Editing Json data should be simple and result in valid Json.`}
  public whatCard: CardModel = { Title: 'What', Body: `This is a static web application written using the Angular framework. Our tool lets our users upload, visualize, edit, and export json data.`}
  public whoCard: CardModel = { Title: 'Who', Body: `Intended audience is anyone working with Json  and needs a more robust tool to work with data.`}

  constructor(private router: Router) {    
  }

  ngOnInit(): void {
  }

}
