import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonCanvasComponent } from './json-canvas.component';

describe('JsonCanvasComponent', () => {
  let component: JsonCanvasComponent;
  let fixture: ComponentFixture<JsonCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
