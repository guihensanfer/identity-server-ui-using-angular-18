import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByPasswordComponent } from './by-password.component';

describe('ByPasswordComponent', () => {
  let component: ByPasswordComponent;
  let fixture: ComponentFixture<ByPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
