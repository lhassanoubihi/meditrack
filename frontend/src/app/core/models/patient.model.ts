export type PatientGender = 'M' | 'F' | 'Autre';

export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'
  | 'Inconnu';

export interface EmergencyContact {
  name?: string;
  phone?: string;
  relation?: string;
}

export interface PatientContact {
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
}

export interface PatientModificationEntry {
  modifiedAt: string;
  modifiedBy: string;
  summary?: string;
  changes?: Record<string, unknown>;
}

export interface Patient {
  _id?: string;
  id?: string;
  userId?: string | null;
  firstName: string;
  lastName: string;
  cin: string;
  dateOfBirth: string;
  gender: PatientGender;
  bloodGroup: BloodGroup;
  contact: PatientContact;
  antecedents: string[];
  allergies: string[];
  traitements: string[];
  notes?: string;
  isArchived?: boolean;
  modificationHistory?: PatientModificationEntry[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientPayload {
  firstName: string;
  lastName: string;
  cin: string;
  dateOfBirth: string;
  gender: PatientGender;
  bloodGroup: BloodGroup;
  contact: PatientContact;
  antecedents: string[];
  allergies: string[];
  traitements: string[];
  notes?: string;
}

export interface CreatePatientResponse {
  status: 'success';
  message: string;
  data: {
    patient: Patient;
  };
}
