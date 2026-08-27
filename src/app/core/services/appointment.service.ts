import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Appointment } from '../models/appointment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/appointments`;

  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  updateStatus(id: string, status: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/status`, { status });
  }

  cancel(id: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/cancel`, {});
  }

  create(req: any): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, req);
  }

  getAvailableSlots(date: string, serviceId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/available-slots?date=${date}&serviceId=${serviceId}`);
  }

  getMyHistory(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/my-history`);
  }
}
