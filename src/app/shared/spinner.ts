import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `<span class="spinner" [style.width.px]="size()" [style.height.px]="size()"></span>`,
  styles: `
    :host {
      display: inline-flex;
    }
    .spinner {
      display: inline-block;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class Spinner {
  readonly size = input(20);
}
