import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast | null>(null);
  public toast$ = this.toastSubject.asObservable();

  showSuccess(title: string, message?: string, duration = 5000) {
    this.show({
      id: this.generateId(),
      type: 'success',
      title,
      message,
      duration
    });
  }

  showError(title: string, message?: string, duration = 5000) {
    this.show({
      id: this.generateId(),
      type: 'error',
      title,
      message,
      duration
    });
  }

  showWarning(title: string, message?: string, duration = 5000) {
    this.show({
      id: this.generateId(),
      type: 'warning',
      title,
      message,
      duration
    });
  }

  showInfo(title: string, message?: string, duration = 5000) {
    this.show({
      id: this.generateId(),
      type: 'info',
      title,
      message,
      duration
    });
  }

  private show(toast: Toast) {
    this.toastSubject.next(toast);
  }

  hide() {
    this.toastSubject.next(null);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}