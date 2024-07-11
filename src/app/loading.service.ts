import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() { }

  public loading: boolean = false;

  public showLoading(){
    this.loading = true;    
  }

  public hideLoading(){
    this.loading = false;
  }
}
