import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BusinessHours } from '../models/business-hours.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessHoursService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/business-hours`;

  findAll(): Observable<BusinessHours[]> {
    return this.http.get<BusinessHours[]>(this.apiUrl);
  }

  create(businessHours: BusinessHours): Observable<BusinessHours> {
    return this.http.post<BusinessHours>(this.apiUrl, businessHours);
  }

  update(id: string, businessHours: BusinessHours): Observable<BusinessHours> {
    return this.http.put<BusinessHours>(`${this.apiUrl}/${id}`, businessHours);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
