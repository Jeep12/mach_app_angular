import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminOrEmployeeGuard } from './admin-or-employee.guard';

describe('adminOrEmployeeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminOrEmployeeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
