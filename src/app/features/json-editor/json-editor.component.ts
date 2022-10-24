import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, Self, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { CardModel } from 'src/app/shared/models/CardModel';
import { ParserService } from 'src/app/shared/services/parserService/parser.service';
import { ValidjsonService } from 'src/app/shared/services/validjson.service';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements OnInit, OnDestroy {
  public colorControl = new FormControl('primary');
  public fontSizeControl = new FormControl(16, Validators.min(10));
  public options = this._formBuilder.group({
    color: this.colorControl,
    fontSize: this.fontSizeControl,
  });
  
  public file: File | null = null;
  public fileContent: any = '';
  public validJson: boolean = false;
  @ViewChild('inputJson', { read: ElementRef }) inputJson: ElementRef<HTMLElement> | undefined;
  public sub: Subscription | undefined;
  public exampleString = `Ex. { "events" : "hi" }`
  public uploadCard: CardModel = { Title: 'Browse file on Computer', Body: 'You can select a .txt file from your computer with valid JSON and watch it come to life.'}
  public emptyCanvasCard: CardModel = { Title: 'Just want to take a peek?', Body: 'If you wanna see what this tool is about, just click below. A simple JSON object will get loaded to play with.'}
  public typedDataCard: CardModel = { Title: 'Type in JSON', Body: 'Feel free to type in or copy and paste JSON data into the textarea below.'}

  constructor(private host: ElementRef<HTMLInputElement>,
    public isValidService: ValidjsonService,
    public paserService: ParserService,
    private _formBuilder: FormBuilder) { }
    
  ngOnInit(): void {
    this.sub = this.isValidService.isValid.subscribe((value) => { this.validJson = value; })
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  public jsonFileUploaded(fileInputEvent: any) {

    fileInputEvent = fileInputEvent as HTMLInputElement;

    if (fileInputEvent && fileInputEvent.target && fileInputEvent.target.files.length > 0) {
      let file = fileInputEvent.target.files[0];

      this.file = file;
      let reader = new FileReader();
      let self = this;
      reader.onload = function (e) {
        // The file's text will be printed here
        if (e && e.target) {
          self.fileContent = reader.result;
          self.isValidService.changeIfValid(self.ValidateJSON(reader.result));
          self.handleFile(file.name);
        }
      };
      reader.readAsText(file);
    }
  }

  public ValidateJSON(str: any): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      this.fileContent = '';
      return false;
    }
    return true;
  }

  public handleFile(title: string = '') {
    this.paserService.fileTitle = title
    this.paserService.fileContent = this.fileContent;
    this.paserService.parseJson();
  }

  public userTypedJson() {
    let input = this.inputJson?.nativeElement as HTMLInputElement
    let isValid = this.ValidateJSON(input.value);
    if (isValid) {
      this.fileContent = input.value;
      this.isValidService.changeIfValid(isValid);
      this.paserService.fileContent = input.value;
      this.paserService.parseJson();
    }
  }

  public noDataCanvas() {
    let emptyJSON = `{"key":"value"}`;
    let isValid = this.ValidateJSON(emptyJSON)
    if (isValid) {
      this.fileContent = emptyJSON;
      this.isValidService.changeIfValid(isValid);
      this.paserService.fileContent = emptyJSON;
      this.paserService.parseJson();
    }
  }

  getFontSize() {
    return Math.max(10, this.fontSizeControl.value || 0);
  }
}
