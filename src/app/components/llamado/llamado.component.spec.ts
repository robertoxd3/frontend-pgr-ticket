import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadoComponent } from './llamado.component';

describe('LlamadoComponent', () => {
  let component: LlamadoComponent;
  let fixture: ComponentFixture<LlamadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LlamadoComponent]
    });
    fixture = TestBed.createComponent(LlamadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
