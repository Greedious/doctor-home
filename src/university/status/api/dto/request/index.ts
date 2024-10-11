export enum universityStatus {
  dateEntryPhase = 'dataEntryPhase',

  registrationPhase = 'registrationPhase',

  schedulingPhase = 'schedulingPhase',

  attendancePhase = 'attendancePhase',
}

export const validStatuses = {
  dateEntryPhase: [universityStatus.registrationPhase],
  registrationPhase: [universityStatus.schedulingPhase],
  schedulingPhase: [universityStatus.attendancePhase],
  attendancePhase: [],
};

export class UpdateStatusRequest {
  status: universityStatus;
}
