import { Injectable } from '@angular/core';
import { JsonMapperModel } from '../../models/JsonMapperModel';

@Injectable({
  providedIn: 'root'
})
export class ParserService {
  public jsonModel: Array<JsonMapperModel> = [];
  private levelIndex = 0;
  private groupIndex = 0;
  private highestIndex = 0;
  private arrayStart: JsonMapperModel = { Array: 'start', cols: 1 }
  private endStart: JsonMapperModel = { Array: 'end', cols: 1 }
  private objectStart: JsonMapperModel = { Object: 'start', cols: 1 }
  private objectEnd: JsonMapperModel = { Object: 'end', cols: 1 }
  private emtpyTile: JsonMapperModel = { cols: 1, Text: ' ', Symbol: true }
  private keySeperator: JsonMapperModel = { cols: 1, Text: ':', Symbol: true }
  private highestNestedValue = 0;
  public fileContent: string = '';
  constructor() { }

  public clearContent() { 
    this.jsonModel = [];
    this.fileContent = '';
    this.levelIndex = 0;
    this.groupIndex = 0;
    this.highestIndex = 0;
    this.highestNestedValue = 0;
  }

  public parseJson() {
    //console.warn(this.fileContent).
    let readyFormatt = JSON.parse(this.fileContent);
    this.startJsonParse(readyFormatt);
  }

  private dealWithOjbect(data: any) {
    for (let prop in data) {
      //start by pushing the key to array
      let keyitem: JsonMapperModel = Object();
      keyitem.Key = true;
      keyitem.Text = prop;
      keyitem.cols = 1;
      this.jsonModel.push(keyitem);
      this.jsonModel.push(this.keySeperator)
      //let valueitem: JsonMapperModel = Object();
      // check if value is array
      if (Array.isArray(data[prop])) {
        this.jsonModel.push(this.arrayStart);
        this.dealWithArray(data[prop])
        this.jsonModel.push(this.endStart);
      }
      else if (data[prop] instanceof Object) {
        this.jsonModel.push(this.objectStart)
        this.dealWithOjbect(data[prop])
        this.jsonModel.push(this.objectEnd)
        this.jsonModel.push(this.emtpyTile)

      }
      // lastly should be a value type
      else {
        let valueItem: JsonMapperModel = Object();
        valueItem.Key = false;
        valueItem.Text = data[prop];
        valueItem.cols = 1;
        this.jsonModel.push(valueItem);
        this.jsonModel.push(this.emtpyTile)

      }

    }

  }

  private dealWithArray(data: any) {
    //item.Value = [];
    const jsonLength = data.length;
    const jsonArray = data;
    for (let i = 0; i < jsonLength; i++) {
      let itemToBeParsed = jsonArray[i]
      // check for nested arrays
      if (Array.isArray(itemToBeParsed)) {
        this.jsonModel.push(this.arrayStart);
        this.dealWithArray(itemToBeParsed)
        this.jsonModel.push(this.endStart);
      }
      // check for array of Objects
      else if (itemToBeParsed instanceof Object) {
        this.jsonModel.push(this.objectStart)
        this.dealWithOjbect(itemToBeParsed)
        this.jsonModel.push(this.objectEnd)
      }
      else {
        let arrayItem: JsonMapperModel = Object();
        arrayItem.Key = false;
        arrayItem.Text = itemToBeParsed;
        arrayItem.cols = 1;
        this.jsonModel.push(arrayItem);

      }

      // lastly should be array of values


    }
  }

  /**
   * Needed a clear starting point for now maybe in future this will be refactored 
   * @param data json to parse
   */
  private startJsonParse(data: any) {
    // do logic if json is just a value

    //do something
    for (let type in data) {
      let item: JsonMapperModel = Object();
      item.Key = true;
      item.Text = type;
      item.cols = 1;

      this.jsonModel.push(item);
      this.jsonModel.push(this.keySeperator)
      // if json is an array 
      if (Array.isArray(data[type])) {
        this.jsonModel.push(this.arrayStart);

        let emptTile = Object.assign({}, this.emtpyTile);
        emptTile.cols = 12;
        this.jsonModel.push(emptTile)
        this.dealWithArray(data[type])
        this.jsonModel.push(this.endStart);
      }
      else if (data[type] instanceof Object && !data[type].length) {
        this.jsonModel.push(this.objectStart)
        this.dealWithOjbect(data[type])
        this.jsonModel.push(this.objectEnd)
      }
      else {
        let valueItem: JsonMapperModel = Object();
        valueItem.Key = false;
        valueItem.Text = data[type];
        valueItem.cols = 1;
        this.jsonModel.push(valueItem);

      }
    }
    this.whiteSpaceCalculation(this.jsonModel);
  }

  private whiteSpaceCalculation(jsonData: JsonMapperModel[]) {
    let symbolArray = jsonData.filter(x => x.Array == 'start' || x.Array == 'end' || x.Object == 'start' || x.Object == 'end')
    let highestLevel = 0
    let index = 0
    for (let symb of symbolArray) {
      if (symb.Array == 'start' || symb.Object == 'start') {
        index++
        highestLevel = index > highestLevel ? index : highestLevel
      }
      if (symb.Array == 'end' || symb.Object == 'end') {
        index--
      }
    }
  }
}
