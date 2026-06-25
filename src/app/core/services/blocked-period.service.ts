import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BlockedPeriod } from '../models/blocked-period.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlockedPeriodService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/blocked-periods`;

  findAll(): Observable<BlockedPeriod[]> {
    return this.http.get<BlockedPeriod[]>(this.apiUrl);
  }

  create(period: BlockedPeriod): Observable<BlockedPeriod> {
    return this.http.post<BlockedPeriod>(this.apiUrl, period);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
