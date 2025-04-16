import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSpecificationsComponent } from './users-specifications.component';

describe('UsersSpecificationsComponent', () => {
  let component: UsersSpecificationsComponent;
  let fixture: ComponentFixture<UsersSpecificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersSpecificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersSpecificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
