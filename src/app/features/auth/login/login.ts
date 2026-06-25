import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = false;
  errorMsg = '';

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const role = this.authService.getUserRole();
        if (role === 'OWNER' || role === 'ROLE_OWNER') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/client/booking']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'E-mail ou senha incorretos.';
        console.error(err);
      }
    });
  }
}
