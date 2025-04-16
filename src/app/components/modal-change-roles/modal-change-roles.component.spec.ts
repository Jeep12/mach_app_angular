import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChangeRolesComponent } from './modal-change-roles.component';

describe('ModalChangeRolesComponent', () => {
  let component: ModalChangeRolesComponent;
  let fixture: ComponentFixture<ModalChangeRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalChangeRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalChangeRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
