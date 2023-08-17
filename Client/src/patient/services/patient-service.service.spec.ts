import { TestBed } from '@angular/core/testing';

import { PatientServiceService } from './patient-service.service';

describe('PatientServiceService', () => {
  let service: PatientServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
