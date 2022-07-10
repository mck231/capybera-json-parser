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
  });

  it('should try to parse json but fail', () => {
    service.fileContent = notFormatedCorrectlyJson;
    service.parseJson();
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