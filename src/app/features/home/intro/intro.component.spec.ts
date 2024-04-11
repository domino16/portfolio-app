import { ComponentFixture, TestBed } from '@angular/core/testing';

import { introComponent } from './intro.component';

describe('introComponent', () => {
  let component: introComponent;
  let fixture: ComponentFixture<introComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [introComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(introComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
