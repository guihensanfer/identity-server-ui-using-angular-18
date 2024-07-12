
import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { LoadingComponent } from "./loading/loading.component";
import { CommonModule } from '@angular/common';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslocoModule, LoadingComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {    
  constructor(public _loading :LoadingService){}
  title = 'identity-server-ui';


}
