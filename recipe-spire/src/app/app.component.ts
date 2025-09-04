import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService } from './shared/services/toast.service';
import { Toast } from './shared/components/toast/toast.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'RecipeSpire';
  currentToast: Toast | null = null;
  private toastSubscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastSubscription = this.toastService.toast$.subscribe(toast => {
      this.currentToast = toast;
    });
  }

  ngOnDestroy() {
    this.toastSubscription?.unsubscribe();
  }

  onToastClosed() {
    this.currentToast = null;
  }
}