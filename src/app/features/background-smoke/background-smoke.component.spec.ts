import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundSmokeComponent } from './background-smoke.component';

describe('BackgroundSmokeComponent', () => {
  let component: BackgroundSmokeComponent;
  let fixture: ComponentFixture<BackgroundSmokeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundSmokeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BackgroundSmokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
