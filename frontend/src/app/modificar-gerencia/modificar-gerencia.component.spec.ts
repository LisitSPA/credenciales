import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarGerenciaComponent } from './modificar-gerencia.component';

describe('ModificarGerenciaComponent', () => {
  let component: ModificarGerenciaComponent;
  let fixture: ComponentFixture<ModificarGerenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarGerenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarGerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
