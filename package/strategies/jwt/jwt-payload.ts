import { Types, User } from 'src/account/user/data/user.schema';
import { Privilege } from 'src/privilege/data/privilege.schema';

export interface JWTPayload {
  id: number;
  username: string;
  phoneNumber: string;
  isActive: boolean;
  type: string[];
  role: Types[];
  privileges: string[];
  operator?: number;
  vendor?: number;
  doctor?: number;
  teacher?: number;
  student?: number;
  supervisor?: number;
}

export function buildJWTPayload(user: User) {
  const { id, username, phoneNumber, isActive, type, role } = user;

  const rolesArray = [role.role];
  const typesArray = [type];

  if (user.doctor?.studentId) rolesArray.push(Types.STUDENT);
  if (user.doctor?.teacherId) rolesArray.push(Types.TEACHER);
  if (user.doctor?.studentId) typesArray.push(Types.STUDENT);
  if (user.doctor?.teacherId) typesArray.push(Types.TEACHER);
  if (user.doctor?.supervisorId) typesArray.push(Types.SUPERVISOR);

  console.log(user);

  const result: JWTPayload = {
    id,
    isActive,
    phoneNumber,
    type: typesArray,
    username,
    doctor: user.doctorId,
    operator: user.operatorId,
    vendor: user.vendorId,
    // university: user.universityId,
    role: rolesArray,
    privileges: role.privileges.map((item: Privilege) => item.key),
    teacher: user.doctor?.teacherId,
    student: user.doctor?.studentId,
    supervisor: user.doctor?.supervisorId,
  };
  return result;
}
