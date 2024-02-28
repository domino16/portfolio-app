import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagneticLinkButtonComponent } from './magnetic-link-button.component';

describe('MagneticLinkButtonComponent', () => {
  let component: MagneticLinkButtonComponent;
  let fixture: ComponentFixture<MagneticLinkButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagneticLinkButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MagneticLinkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
