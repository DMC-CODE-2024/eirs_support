import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CeirHeaderComponent } from './ceir-header.component';

describe('CeirHeaderComponent', () => {
  let component: CeirHeaderComponent;
  let fixture: ComponentFixture<CeirHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CeirHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CeirHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
