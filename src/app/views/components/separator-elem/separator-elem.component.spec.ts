import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeparatorElemComponent } from './separator-elem.component';

describe('SeparatorElemComponent', () => {
  let component: SeparatorElemComponent;
  let fixture: ComponentFixture<SeparatorElemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeparatorElemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeparatorElemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
