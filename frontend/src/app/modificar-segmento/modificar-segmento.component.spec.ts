import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarSegmentoComponent } from './modificar-segmento.component';

describe('ModificarSegmentoComponent', () => {
  let component: ModificarSegmentoComponent;
  let fixture: ComponentFixture<ModificarSegmentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarSegmentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarSegmentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
