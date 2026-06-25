import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private counter = 0;
  private toastsSubject = new Subject<Toast>();
  private dismissSubject = new Subject<number>();

  toasts$ = this.toastsSubject.asObservable();
  dismiss$ = this.dismissSubject.asObservable();

  success(message: string, duration = 4000) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000) {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 4000) {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 4500) {
    this.show(message, 'warning', duration);
  }

  private show(message: string, type: Toast['type'], duration: number) {
    const id = ++this.counter;
    this.toastsSubject.next({ id, message, type, duration });
  }

  dismiss(id: number) {
    this.dismissSubject.next(id);
  }
}
