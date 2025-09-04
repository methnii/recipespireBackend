import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full border-b-2 border-primary-600"
           [class]="sizeClass"></div>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get sizeClass(): string {
    switch (this.size) {
      case 'sm': return 'h-6 w-6';
      case 'lg': return 'h-16 w-16';
      default: return 'h-12 w-12';
    }
  }
}