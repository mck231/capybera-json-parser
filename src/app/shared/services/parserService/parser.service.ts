import { Injectable } from '@angular/core';
import { JsonMapperModel } from '../../models/JsonMapperModel';

@Injectable({
  providedIn: 'root'
})
export class ParserService {
  public jsonModel: Array<JsonMapperModel> = [];
  private arrayStart: JsonMapperModel = { Array: 'start', Key: false }
  private endStart: JsonMapperModel = { Array: 'end', Key: false }
  private objectStart: JsonMapperModel = { Object: 'start', Key: false }
  private objectEnd: JsonMapperModel = { Object: 'end', Key: false }
  private emtpyTile: JsonMapperModel = { Text: ' ', Symbol: true, Key: false }
  private keySeperator: JsonMapperModel = { Symbol: true, Key: false, KeyLink: true }
  public fileContent: string = '';
  public fileTitle = '';
  constructor() { }

  public clearContent() {
    this.jsonModel = [];
    this.fileContent = '';
  }
  public parseJson() {
    try {
      const formattedJson = JSON.parse(this.fileContent);
      this.startJsonParse(formattedJson);
      console.table(this.jsonModel);
    } catch (error) {
      console.log(error);
    }
  }

  private startJsonParse(data: any) {
    if (Array.isArray(data)) {
      this.handleArrayRoot(data);
    } else {
      this.handleObjectRoot(data);
    }
    // this.whiteSpaceCalculation(this.jsonModel);
  }

  private handleArrayRoot(data: any[]) {
    this.jsonModel.push(this.arrayStart);
    this.dealWithArray(data);
    this.jsonModel.push(this.endStart);
  }

  private handleObjectRoot(data: any) {
    for (let type in data) {
      this.jsonModel.push({ Key: true, Text: type });
      this.jsonModel.push(this.keySeperator);

      if (Array.isArray(data[type])) {
        this.handleArrayProperty(data[type]);
      } else if (this.isObject(data[type])) {
        this.handleObjectProperty(data[type]);
      } else {
        this.handlePrimitiveProperty(data[type]);
      }
    }
  }

  private isObject(value: any): boolean {
    return value instanceof Object && !Array.isArray(value);
  }

  private handleArrayProperty(data: any[]) {
    this.jsonModel.push(this.arrayStart);
    this.dealWithArray(data);
    this.jsonModel.push(this.endStart);
  }

  private handleObjectProperty(data: any) {
    this.jsonModel.push(this.objectStart);
    this.dealWithOjbect(data);
    this.jsonModel.push(this.objectEnd);
  }

  private handlePrimitiveProperty(value: any) {
    const valueItem: JsonMapperModel = { Key: false };
    this.determineValueType(value, valueItem);
    this.jsonModel.push(valueItem);
  }

  private dealWithOjbect(data: any) {
    for (let prop in data) {
      this.jsonModel.push({ Key: true, Text: prop });
      this.jsonModel.push(this.keySeperator);

      if (Array.isArray(data[prop])) {
        this.handleArrayProperty(data[prop]);
      } else if (this.isObject(data[prop])) {
        this.handleObjectProperty(data[prop]);
      } else {
        this.handlePrimitiveProperty(data[prop]);
      }
    }
  }

  private dealWithArray(data: any) {
    for (let item of data) {
      if (Array.isArray(item)) {
        this.handleArrayProperty(item);
      } else if (this.isObject(item)) {
        this.handleObjectProperty(item);
      } else {
        this.handlePrimitiveProperty(item);
      }
    }
  }

  private determineValueType(value: any, valueItem: JsonMapperModel): void {
    if (typeof value === 'boolean') {
      valueItem.Boolean = value;
    } else if (typeof value === 'string') {
      valueItem.Text = value;
    } else if (typeof value === 'number') {
      valueItem.Number = value;
    } else if (value == null) {
      valueItem.NullValue = true;
    }
  }

  // private whiteSpaceCalculation(jsonData: JsonMapperModel[]) {
  //   let symbolArray = jsonData.filter(x => x.Array == 'start' || x.Array == 'end' || x.Object == 'start' || x.Object == 'end')
  //   let highestLevel = 0
  //   let index = 0
  //   for (let symb of symbolArray) {
  //     if (symb.Array == 'start' || symb.Object == 'start') {
  //       index++
  //       highestLevel = index > highestLevel ? index : highestLevel
  //     }
  //     if (symb.Array == 'end' || symb.Object == 'end') {
  //       index--
  //     }
  //   }
  // }
}
