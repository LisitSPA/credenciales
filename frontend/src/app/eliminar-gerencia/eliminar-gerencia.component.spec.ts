import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarGerenciaComponent } from './eliminar-gerencia.component';

describe('EliminarGerenciaComponent', () => {
  let component: EliminarGerenciaComponent;
  let fixture: ComponentFixture<EliminarGerenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarGerenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarGerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
