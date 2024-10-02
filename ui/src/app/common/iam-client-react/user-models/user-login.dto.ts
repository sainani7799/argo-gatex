export class LoginUserDto {
  username: string;
  password: string;
  authServerUrl: string
  unitId?:number
  
  /**
   * 
   * @param username 
   * @param password 
   * @param authServerUrl 
   */
  constructor(username: string, password: string,authServerUrl:string,unitId?:number) {
    this.username = username;
    this.password = password;
    this.authServerUrl = authServerUrl;
    this.unitId = unitId
  }
}