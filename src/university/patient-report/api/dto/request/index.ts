export class CreatePatientReport {
  appointmentId: number;
  patientAge: number;
  patientName: string;
  description: string;
}

export class UpdatePatientReport {
  appointmentId?: number;
  patientAge?: number;
  patientName?: string;
  description?: string;
}
