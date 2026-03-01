import { UserEntity } from "./entity/user.entity";

export const toUserDto = (data: UserEntity): any => {  
  const { userId, userName, employeeId, cardNo,unitId, versionFlag } = data;
  let userDto: any = { userId, userName ,employeeId, cardNo,unitId, versionFlag };
  return userDto;
};