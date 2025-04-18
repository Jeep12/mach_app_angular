import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResendEmailRecoveryComponent } from './modal-resend-email-recovery.component';

describe('ModalResendEmailRecoveryComponent', () => {
  let component: ModalResendEmailRecoveryComponent;
  let fixture: ComponentFixture<ModalResendEmailRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalResendEmailRecoveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalResendEmailRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
