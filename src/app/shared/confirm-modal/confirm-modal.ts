import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-overlay" (click)="onCancel()">
        <div class="confirm-modal card" (click)="$event.stopPropagation()">
          <div class="modal-icon" [class]="iconClass">
            <i [class]="'ph ph-' + icon"></i>
          </div>
          <h3>{{ title }}</h3>
          <p class="text-secondary">{{ message }}</p>
          <div class="modal-actions">
            <button class="btn btn-outline" (click)="onCancel()">Cancelar</button>
            <button class="btn" [class]="confirmBtnClass" (click)="onConfirm()">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .confirm-modal {
      max-width: 400px;
      width: 100%;
      text-align: center;
      padding: 2rem;
      animation: modalIn 0.25s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
      background-color: #121214;
    }
    .modal-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
      font-size: 1.5rem;
    }
    .modal-icon.danger {
      background: rgba(239, 68, 68, 0.1);
      color: #fca5a5;
    }
    .modal-icon.warning {
      background: rgba(245, 158, 11, 0.1);
      color: #fcd34d;
    }
    .modal-icon.info {
      background: rgba(59, 130, 246, 0.1);
      color: #93c5fd;
    }
    h3 {
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
    }
    p {
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    .modal-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }
    .modal-actions .btn {
      min-width: 120px;
    }
    .btn-danger {
      background-color: #ef4444;
      color: #fff;
      font-weight: 600;
    }
    .btn-danger:hover {
      background-color: #dc2626;
    }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.9) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class ConfirmModal {
  @Input() isOpen = false;
  @Input() title = 'Confirmar ação';
  @Input() message = 'Tem certeza que deseja continuar?';
  @Input() confirmText = 'Confirmar';
  @Input() icon = 'warning';
  @Input() variant: 'danger' | 'warning' | 'info' = 'danger';
  
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get iconClass(): string {
    return this.variant;
  }

  get confirmBtnClass(): string {
    return this.variant === 'danger' ? 'btn-danger' : 'btn-primary';
  }

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
