import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreatePatientPayload, CreatePatientResponse } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/patients`;

  createPatient(payload: CreatePatientPayload): Observable<CreatePatientResponse> {
    return this.http.post<CreatePatientResponse>(this.apiUrl, payload);
  }
}
