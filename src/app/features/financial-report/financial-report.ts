import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-financial-report',
  imports: [CommonModule],
  templateUrl: './financial-report.html',
  styleUrl: './financial-report.css'
})
export class FinancialReport implements OnInit {
  private http = inject(HttpClient);
  
  revenueData: any = null;
  loading = false;
  errorMsg = '';

  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  years = [2024, 2025, 2026, 2027];

  ngOnInit() {
    this.fetchRevenue();
  }

  fetchRevenue() {
    this.loading = true;
    this.errorMsg = '';
    
    // Using environment api directly as requested for this specific endpoint: /api/appointments/revenue?month=X&year=Y
    this.http.get<any>(`${environment.apiUrl}/appointments/revenue?month=${this.selectedMonth}&year=${this.selectedYear}`).subscribe({
      next: (data) => {
        this.revenueData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading revenue', err);
        this.errorMsg = 'Erro ao carregar os dados financeiros.';
        this.loading = false;
      }
    });
  }

  changeMonth(event: any) {
    this.selectedMonth = parseInt(event.target.value, 10);
    this.fetchRevenue();
  }

  changeYear(event: any) {
    this.selectedYear = parseInt(event.target.value, 10);
    this.fetchRevenue();
  }
}
