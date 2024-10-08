import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargarCredencialComponent } from './descargar-credencial.component';

describe('DescargarCredencialComponent', () => {
  let component: DescargarCredencialComponent;
  let fixture: ComponentFixture<DescargarCredencialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescargarCredencialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescargarCredencialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
