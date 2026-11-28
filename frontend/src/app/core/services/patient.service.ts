import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CreatePatientPayload,
  CreatePatientResponse,
  PatientDetailResponse,
  PatientListParams,
  PatientListResponse,
  UpdatePatientPayload,
  UpdatePatientResponse
} from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/patients`;

  listPatients(params: PatientListParams = {}): Observable<PatientListResponse> {
    let httpParams = new HttpParams();
    if (params.search && params.search.trim()) {
      httpParams = httpParams.set('search', params.search.trim());
    }
    if (params.page) {
      httpParams = httpParams.set('page', String(params.page));
    }
    if (params.limit) {
      httpParams = httpParams.set('limit', String(params.limit));
    }
    if (params.includeArchived !== undefined) {
      httpParams = httpParams.set('includeArchived', String(params.includeArchived));
    }
    return this.http.get<PatientListResponse>(this.apiUrl, { params: httpParams });
  }

  createPatient(payload: CreatePatientPayload): Observable<CreatePatientResponse> {
    return this.http.post<CreatePatientResponse>(this.apiUrl, payload);
  }

  getPatientById(id: string): Observable<PatientDetailResponse> {
    return this.http.get<PatientDetailResponse>(`${this.apiUrl}/${id}`);
  }

  getMyDossier(): Observable<PatientDetailResponse> {
    return this.http.get<PatientDetailResponse>(`${this.apiUrl}/me`);
  }

  updatePatient(id: string, payload: UpdatePatientPayload): Observable<UpdatePatientResponse> {
    return this.http.put<UpdatePatientResponse>(`${this.apiUrl}/${id}`, payload);
  }

  archivePatient(id: string): Observable<UpdatePatientResponse> {
    return this.http.patch<UpdatePatientResponse>(`${this.apiUrl}/${id}/archive`, {});
  }
}
