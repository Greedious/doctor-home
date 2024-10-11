export const errorCode = {
  notFoundRole: 1001,

  notFoundUser: 2001,
  userAlreadyExist: 2002,
  userNotExist: 2003,

  loginFailed: 3001,
  wrongCreds: 3002,
  notFoundToken: 3003,

  notFoundCategory: 4001,
  categoryAlreadyExist: 4002,
  noImageSubcategory: 4003,

  notFoundAd: 5001,

  notFoundProduct: 6001,
  cardIsChanged: 6002,
  notFoundFavoriteProduct: 6003,
  alreadyFavorite: 6004,

  notFoundDiscount: 7001,
  discountExist: 7002,

  notFoundOrder: 8001,

  notFoundVariant: 9001,

  notFoundArea: 10001,

  notFoundAddress: 11001,

  notFoundReview: 12001,
  alreadyReviewedProduct: 12002,

  notFoundSubject: 13001,
  subjectHasNoAssignedTask: 13002,
  subjectHasNoTeacher: 13003,
  subjectHasMissingSchedules: 13004,
  subjectHasNoChairs: 13005,

  notFoundStudent: 14001,
  studentNotAssignedToGroup: 14002,
  subjectNotInStudentYear: 14003,
  studentsNotInSameGroup: 14004,
  studentHasNoChairOnSubject: 14005,

  notFoundTeacher: 14001,
  notAssignedTeacher: 14002,
  alreadyAssignedTeacher: 14003,
  teacherDoesNotTeachTheSubject: 14004,

  notFoundYear: 15001,

  sameYearRank: 15002,

  notFoundGroup: 16001,
  alreadyAssignedGroup: 16002,
  notSameYearWithSubject: 16003,
  groupIsNotAvailable: 16004,

  notFoundSpecialty: 17001,
  cannotDeleteSpecialty: 17002,

  notFoundChair: 18001,
  chairCapacityLimitExceeded: 18002,

  notFoundStatus: 19001,
  notValidStatus: 19002,

  notFoundQuestion: 20001,

  notFoundTask: 21001,
  alreadyHasCard: 21002,

  notFoundPatient: 22001,

  notFoundAppointment: 22001,
  notAllowedTime: 22001,
  appointmentConflict: 22002,
  appointmentDoesNotHavePatient: 22003,

  notFoundSupervisor: 23001,
  alreadyAssignedSupervisor: 23002,
  supervisorDoesNotTeachTheSubject: 23003,
  notAssignedSupervisor: 23004,
  alreadyTaught: 23005,

  notFoundPatientReport: 24001,

  notFoundSupervisorLog: 25001,

  notFoundMark: 26001,
  studentAlreadyHasMark: 260002,
};
