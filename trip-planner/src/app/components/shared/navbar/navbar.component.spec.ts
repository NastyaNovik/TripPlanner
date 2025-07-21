import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        RouterModule.forRoot([]),
        MatIconModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
