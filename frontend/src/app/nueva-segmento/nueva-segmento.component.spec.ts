import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaSegmentoComponent } from './nueva-segmento.component';

describe('NuevaSegmentoComponent', () => {
  let component: NuevaSegmentoComponent;
  let fixture: ComponentFixture<NuevaSegmentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaSegmentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaSegmentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
