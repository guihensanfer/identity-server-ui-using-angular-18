import { Component } from '@angular/core';
import { SeparatorElemComponent } from "../separator-elem/separator-elem.component";
import { TranslocoModule } from '@ngneat/transloco';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [SeparatorElemComponent, TranslocoModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {
  constructor(private router: Router) {}

  refreshPage(): void {
    window.location.reload();
  }
}
