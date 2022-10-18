import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponentComponent } from './card-component.component';

describe('CardComponentComponent', () => {
  let component: CardComponentComponent;
  let fixture: ComponentFixture<CardComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CardComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
