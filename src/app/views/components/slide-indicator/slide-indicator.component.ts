import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slide-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-indicator.component.html',
  styleUrl: './slide-indicator.component.css'
})
export class SlideIndicatorComponent {
  @Input() slides: any[] = [];
  @Input() currentSlide: number = 0;
}
