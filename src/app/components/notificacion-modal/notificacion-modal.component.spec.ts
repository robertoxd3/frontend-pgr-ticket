import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionModalComponent } from './notificacion-modal.component';

describe('NotificacionModalComponent', () => {
  let component: NotificacionModalComponent;
  let fixture: ComponentFixture<NotificacionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificacionModalComponent]
    });
    fixture = TestBed.createComponent(NotificacionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
