import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'icon-home-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './icon-home-button.component.html',
  styleUrls: ['./icon-home-button.component.scss']
})
export class IconHomeButtonComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
