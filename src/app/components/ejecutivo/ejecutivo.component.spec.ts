import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecutivoComponent } from './ejecutivo.component';

describe('EjecutivoComponent', () => {
  let component: EjecutivoComponent;
  let fixture: ComponentFixture<EjecutivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EjecutivoComponent]
    });
    fixture = TestBed.createComponent(EjecutivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
