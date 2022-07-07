import { Component, ElementRef, HostListener, OnInit, Self, ViewChild } from '@angular/core';
import { ParserService } from 'src/app/shared/services/parserService/parser.service';
import { ValidjsonService } from 'src/app/shared/services/validjson.service';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements OnInit {

  public file: File | null = null;
  public fileContent: any = '';
  public validJson: boolean = false;
  @ViewChild('inputJson', {read: ElementRef}) inputJson: ElementRef<HTMLElement> | undefined;

  constructor(private host: ElementRef<HTMLInputElement>, public isValidService: ValidjsonService, public paserService: ParserService) { }

  ngOnInit(): void {
      this.isValidService.isValid.subscribe((value) => { this.validJson = value; })
  }

  ngOnDestroy(): void {
    this.isValidService.isValid.unsubscribe();
  }

  public jsonFileUploaded(fileInputEvent: any) {

    fileInputEvent = fileInputEvent as HTMLInputElement;

    if (fileInputEvent && fileInputEvent.target && fileInputEvent.target.files.length > 0){      
      let file = fileInputEvent.target.files[0];

      this.file = file;
      let reader = new FileReader();
      let self = this;
      reader.onload = function (e) {
        // The file's text will be printed here
        if (e && e.target) {
          self.fileContent = reader.result;
          self.isValidService.changeIfValid(self.ValidateJSON(reader.result));   
          self.handleFile();        
        }
      };
    reader.readAsText(file); 
    }      
  }
    
  public ValidateJSON(str: any): boolean{
    try {
      JSON.parse(str);
  } catch (e) {
      this.fileContent = '';
      return false;
  }
  return true;
  }

  public handleFile() {
    this.paserService.fileContent = this.fileContent;
    this.paserService.parseJson();
  }

  public userTypedJson() {
    // need to cast as any or other html element
    //console.warn(this.inputJson?.nativeElement?.value));    
  }


}
