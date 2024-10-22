import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaGerenciaComponent } from './nueva-gerencia.component';

describe('NuevaGerenciaComponent', () => {
  let component: NuevaGerenciaComponent;
  let fixture: ComponentFixture<NuevaGerenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaGerenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaGerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
