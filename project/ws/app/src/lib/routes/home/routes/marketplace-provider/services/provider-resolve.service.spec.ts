import { TestBed } from '@angular/core/testing';

import { ProviderResolveService } from './provider-resolve.service';

describe('ProviderResolveService', () => {
  let service: ProviderResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProviderResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
