import { Component } from '@angular/core';
import { SeparatorElemComponent } from "../separator-elem/separator-elem.component";
import { TranslocoModule } from '@ngneat/transloco';
import { SharedDataService } from '../../../services/shared-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [SeparatorElemComponent, TranslocoModule, CommonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {
  constructor(public sharedData: SharedDataService) {}

  refreshPage(): void {
    window.location.reload();
  }
}
