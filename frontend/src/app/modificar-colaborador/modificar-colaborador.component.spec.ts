import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarColaboradorComponent } from './modificar-colaborador.component';

describe('ModificarColaboradorComponent', () => {
  let component: ModificarColaboradorComponent;
  let fixture: ComponentFixture<ModificarColaboradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarColaboradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
