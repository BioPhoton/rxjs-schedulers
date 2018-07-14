import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursiveSchedulingComponent } from './recursive-scheduling.component';

describe('RecursiveSchedulingComponent', () => {
  let component: RecursiveSchedulingComponent;
  let fixture: ComponentFixture<RecursiveSchedulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecursiveSchedulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursiveSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
