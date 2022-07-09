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
    expect(service.jsonModel[3].Text).toBe('hi');
  });
  
  it('should parse nested objects', () => {
    service.fileContent = fakeJsonWithObject;
    service.parseJson();
    expect(service.jsonModel.length > 0).toBeTruthy();
    expect(service.jsonModel[6].Text).toBe('hi');
  });

  it('should parse arrays', () => {
    service.fileContent = fakeJsonWithArray;
    service.parseJson();
    expect(service.jsonModel.length > 0).toBeTruthy();
    expect(service.jsonModel[4].Text).toEqual('1');
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