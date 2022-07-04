import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidjsonService {
  public isValid = new BehaviorSubject<boolean>(false);  

  constructor() { }  

  changeIfValid(val: boolean):void {
    this.isValid.next(val);
  }

}
