import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSuccessComponent } from './modal-success.component';

describe('ModalSuccessComponent', () => {
  let component: ModalSuccessComponent;
  let fixture: ComponentFixture<ModalSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
