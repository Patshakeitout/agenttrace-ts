import { TestBed } from '@angular/core/testing';

import { MiniGuardrailsService } from './mini-guardrails.service';

describe('MiniGuardrailsService', () => {
  let service: MiniGuardrailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiniGuardrailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
