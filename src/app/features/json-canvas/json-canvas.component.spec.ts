import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { JsonCanvasComponent } from './json-canvas.component';

describe('JsonCanvasComponent', () => {
  let component: JsonCanvasComponent;
  let fixture: ComponentFixture<JsonCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsonCanvasComponent ],
      imports: [ MatDialogModule],
      providers: [
          { provide: MAT_DIALOG_DATA, useValue: {} },
          { provide: MatDialogRef, useValue: {} }
        ]
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
