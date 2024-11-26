import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class AppLoadingComponent {
  loading: boolean = false;
  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe((loading) => {
      if (loading) {
        console.log('Loading...');
        this.loading = true;
      } else {
        this.loading = false;
        console.log('Done loading.');
      }
    });
  }
}
