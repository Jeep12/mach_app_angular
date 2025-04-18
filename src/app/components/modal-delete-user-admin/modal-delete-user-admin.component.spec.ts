import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteUserAdminComponent } from './modal-delete-user-admin.component';

describe('ModalDeleteUserAdminComponent', () => {
  let component: ModalDeleteUserAdminComponent;
  let fixture: ComponentFixture<ModalDeleteUserAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeleteUserAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDeleteUserAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
