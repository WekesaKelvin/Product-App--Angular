import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent] // Because it's a standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'product-app'`, () => {
    expect(component.title).toEqual('product-app');
  });

  it(`should have userName as 'Kelvin'`, () => {
    expect(component.userName).toEqual('Kelvin');
  });

  it('should contain a router-outlet element', () => {
    fixture.detectChanges(); // Trigger rendering
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).not.toBeNull();
  });
});
