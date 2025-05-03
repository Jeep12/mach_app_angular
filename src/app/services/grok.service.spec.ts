import { TestBed } from '@angular/core/testing';

import { GrokService } from './grok.service';

describe('GrokService', () => {
  let service: GrokService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrokService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
