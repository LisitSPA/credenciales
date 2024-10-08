import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredencialExitosaComponent } from './credencial-exitosa.component';

describe('CredencialExitosaComponent', () => {
  let component: CredencialExitosaComponent;
  let fixture: ComponentFixture<CredencialExitosaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredencialExitosaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredencialExitosaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
