import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-avatar',
  host: {
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.font-size.px]': 'size() * 0.36',
    '[style.background]': 'background()',
    '[style.color]': 'foreground()',
  },
  template: `
    @if (showImage()) {
      <img [src]="src()" [alt]="name()" (error)="onError()" />
    } @else {
      <span aria-hidden="true">{{ initials() }}</span>
    }
  `,
  styles: `
    :host {
      display: inline-grid;
      place-items: center;
      border-radius: 50%;
      overflow: hidden;
      font-weight: 800;
      flex-shrink: 0;
      user-select: none;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,
})
export class Avatar {
  readonly name = input('');
  readonly src = input<string | null>(null);
  readonly size = input(40);

  private readonly failed = signal(false);

  protected readonly showImage = computed(() => Boolean(this.src()) && !this.failed());

  protected readonly initials = computed(() =>
    this.name()
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join(''),
  );

  private readonly hue = computed(() => {
    const name = this.name() || '?';
    let hash = 0;
    for (let index = 0; index < name.length; index++) {
      hash = (hash * 31 + name.charCodeAt(index)) % 360;
    }
    return hash;
  });

  protected readonly background = computed(() => `hsl(${this.hue()} 72% 93%)`);
  protected readonly foreground = computed(() => `hsl(${this.hue()} 55% 36%)`);

  protected onError(): void {
    this.failed.set(true);
  }
}
