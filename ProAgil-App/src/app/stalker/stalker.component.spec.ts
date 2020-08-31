/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StalkerComponent } from './stalker.component';

describe('StalkerComponent', () => {
  let component: StalkerComponent;
  let fixture: ComponentFixture<StalkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StalkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StalkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
