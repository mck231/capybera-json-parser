import { TestBed } from '@angular/core/testing';

import { ValidjsonService } from './validjson.service';

describe('ValidjsonService', () => {
  let service: ValidjsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidjsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
