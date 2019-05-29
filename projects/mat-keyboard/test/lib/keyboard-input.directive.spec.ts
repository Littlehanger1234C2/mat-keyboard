import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatKeyboardModule, MatKeyboard } from '@ngx-extensions/mat-keyboard';

@Component({
  template: '<input #input [matKeyboard]="locale"/>'
})
export class TestComponent {
  locale = 'en';
  @ViewChild('input') inputRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>;
}

describe('MatKeyboardInput', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let inputEl: HTMLInputElement | HTMLTextAreaElement;
  let fakeKeyboard: MatKeyboard;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatKeyboardModule],
      declarations: [TestComponent],
      providers: [{ provide: MatKeyboard, useValue: fakeKeyboard }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fakeKeyboard = jasmine.createSpyObj(MatKeyboard.name, ['open']);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    inputEl = component.inputRef.nativeElement;
  });

  it('should correctly create and reflect initial input state', () => {
    expect(component).toBeTruthy();
    expect(inputEl.value).toBe('');
  });

  it('should correctly open a keyboard on focus', () => {
    inputEl.focus();

    expect(fakeKeyboard.open).toHaveBeenCalled();
  });
});
