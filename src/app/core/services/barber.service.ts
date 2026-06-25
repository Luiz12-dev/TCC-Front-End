import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BarberService as BarberServiceModel } from '../models/barber-service.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarberService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/services`;

  getAll(): Observable<BarberServiceModel[]> {
    return this.http.get<BarberServiceModel[]>(this.apiUrl);
  }

  create(service: BarberServiceModel): Observable<BarberServiceModel> {
    return this.http.post<BarberServiceModel>(this.apiUrl, service);
  }

  update(id: string, service: BarberServiceModel): Observable<BarberServiceModel> {
    return this.http.put<BarberServiceModel>(`${this.apiUrl}/${id}`, service);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
