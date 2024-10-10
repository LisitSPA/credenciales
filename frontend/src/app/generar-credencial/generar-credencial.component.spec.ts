import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarCredencialComponent } from './generar-credencial.component';

describe('GenerarCredencialComponent', () => {
  let component: GenerarCredencialComponent;
  let fixture: ComponentFixture<GenerarCredencialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarCredencialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarCredencialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
