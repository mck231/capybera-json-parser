import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements OnInit {

  public file: File | null = null;
  public fileContent: any = '';

  constructor(private host: ElementRef<HTMLInputElement>) { }

  ngOnInit(): void {
  }

  public jsonFileUploaded(fileInputEvent: any) {

    fileInputEvent = fileInputEvent as HTMLInputElement;

    if (fileInputEvent && fileInputEvent.target && fileInputEvent.target.files.length > 0)
      console.log(fileInputEvent.target.files[0]);
      let file = fileInputEvent.target.files[0];
      let reader = new FileReader();
      let self = this;
      reader.onload = function (e) {
        // The file's text will be printed here
        if (e && e.target) {
          self.fileContent = reader.result;
          console.warn(self.fileContent)
        }
      };
    reader.readAsText(file); 
  }
}
