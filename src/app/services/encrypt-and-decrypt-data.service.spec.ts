import { TestBed } from '@angular/core/testing';

import { EncryptAndDecryptDataService } from './encrypt-and-decrypt-data.service';

describe('EncryptAndDecryptDataService', () => {
  let service: EncryptAndDecryptDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncryptAndDecryptDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
