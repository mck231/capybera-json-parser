import { TestBed } from '@angular/core/testing';

import { ParserService } from './parser.service';

describe('ParserService', () => {
  let service: ParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse json and create json model', () => {
    service.fileContent = fakeJson;
    service.parseJson();
    expect(service.jsonModel.length > 0).toBeTruthy();
    expect(service.jsonModel[2].Text).toBe('hi');
    expect(service.jsonModel[0].Text).toBe('events');
  });

  it('should parse nested objects', () => {
    service.fileContent = fakeJsonWithObject;
    service.parseJson();
    expect(service.jsonModel.length > 0).toBeTruthy();
    expect(service.jsonModel[5].Text).toBe('hi');
  });

  it('should parse arrays', () => {
    service.fileContent = fakeJsonWithArray;
    service.parseJson();
    expect(service.jsonModel.length > 0).toBeTruthy();
    expect(service.jsonModel[3].Number).toEqual(1);
    expect(service.jsonModel[4].Number).toEqual(2);
  });

  it('should try to parse json but fail', () => {
    service.fileContent = notFormatedCorrectlyJson;
    service.parseJson();
    expect(service.jsonModel).toHaveSize(0);
  });
  it('should handle complex json', () => {
    service.fileContent = fakeComplicatedJson;
    service.parseJson();
    expect(service.jsonModel.length > 0).toBeTruthy();
  });
  it('should parse nested arrays', () => {
    service.fileContent = fakeJsonWithNestedArray;
    service.parseJson();
    console.log(service.jsonModel); // Inspect the jsonModel structure and content

    expect(service.jsonModel.length > 0).toBeTruthy();
    expect(service.jsonModel[4].Number).toEqual(1);
    expect(service.jsonModel[5].Number).toEqual(2);
  });

  it('should parse json with boolean values', () => {
    service.fileContent = fakeJsonWithBoolean;
    service.parseJson();
    expect(service.jsonModel.length > 0).toBeTruthy();
    expect(service.jsonModel[2].Boolean).toBeTruthy();
  });

  it('should parse json with null values', () => {
    service.fileContent = fakeJsonWithNull;
    service.parseJson();
    expect(service.jsonModel.length > 0).toBeTruthy();
    expect(service.jsonModel[2].NullValue).toBeTruthy();
  });

  it('should handle empty json', () => {
    service.fileContent = emptyJson;
    service.parseJson();
    expect(service.jsonModel).toHaveSize(0);
  });

  it('should clear content', () => {
    service.fileContent = fakeJson;
    service.clearContent();
    expect(service.fileContent).toBe('');
    expect(service.jsonModel).toHaveSize(0);
  });
});

const fakeJson = `{
  "events": "hi"
}`

const fakeJsonWithObject = `{
  "events": {
    "events": "hi"
  }
}`

const fakeJsonWithArray = `{
  "events": [1,2,3]
}`

const notFormatedCorrectlyJson = `{
  "events": "hi"
`
const fakeComplicatedJson = `{
  "events": [ {"test": 3}, {"test": "8L"}, {"test": true} ]
}`;
const fakeJsonWithNestedArray = `{
  "events": [ [1,2], [3,4] ]
}`;

const fakeJsonWithBoolean = `{
  "events": true
}`;

const fakeJsonWithNull = `{
  "events": null
}`;

const emptyJson = `{}`;
