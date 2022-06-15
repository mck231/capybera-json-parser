import { Component, ElementRef, HostListener, OnInit, Self } from '@angular/core';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements OnInit {

  public file: File | null = null;
  public fileContent: any = '';
  public validJson: boolean = false;

  constructor(private host: ElementRef<HTMLInputElement>) { }

  ngOnInit(): void {
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
          self.validJson = self.ValidateJSON(reader.result);
        }
      };
    reader.readAsText(file); 
    }
      
  }
  public ValidateJSON(str: any){
    try {
      JSON.parse(str);
  } catch (e) {
      this.fileContent = '';
      return false;
  }
  return true;
  }

 


}
