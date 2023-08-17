import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRecordsComponent } from './view-records.component';

describe('ViewRecordsComponent', () => {
  let component: ViewRecordsComponent;
  let fixture: ComponentFixture<ViewRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
