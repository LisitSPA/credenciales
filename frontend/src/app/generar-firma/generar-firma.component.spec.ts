import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarFirmaComponent } from './generar-firma.component';

describe('GenerarFirmaComponent', () => {
  let component: GenerarFirmaComponent;
  let fixture: ComponentFixture<GenerarFirmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarFirmaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarFirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
