import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaExitosaComponent } from './firma-exitosa.component';

describe('FirmaExitosaComponent', () => {
  let component: FirmaExitosaComponent;
  let fixture: ComponentFixture<FirmaExitosaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmaExitosaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirmaExitosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
