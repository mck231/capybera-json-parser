import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { IconHomeButtonComponent } from './icon-home-button.component';

describe('IconHomeButtonComponent', () => {
  let component: IconHomeButtonComponent;
  let fixture: ComponentFixture<IconHomeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconHomeButtonComponent, CommonModule, RouterTestingModule ]
      //,  imports: [CommonModule, RouterModule],

    })
    .compileComponents();

    fixture = TestBed.createComponent(IconHomeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
