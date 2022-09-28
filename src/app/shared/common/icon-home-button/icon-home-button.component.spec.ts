import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHomeButtonComponent } from './icon-home-button.component';

describe('IconHomeButtonComponent', () => {
  let component: IconHomeButtonComponent;
  let fixture: ComponentFixture<IconHomeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ IconHomeButtonComponent ]
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
