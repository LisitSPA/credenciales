import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarokComponent } from './generarok.component';

describe('GenerarokComponent', () => {
  let component: GenerarokComponent;
  let fixture: ComponentFixture<GenerarokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarokComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
