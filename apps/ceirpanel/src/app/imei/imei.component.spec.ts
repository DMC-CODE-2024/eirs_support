import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImeiComponent } from './imei.component';

describe('ImeiComponent', () => {
  let component: ImeiComponent;
  let fixture: ComponentFixture<ImeiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImeiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
