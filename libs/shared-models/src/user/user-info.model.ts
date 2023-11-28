export class UserModel{
    id:number
    name:string;
    contact:number;
    email:string;
  
    constructor(id:number,name:string,contact:number,email:string){
        this.name = name
        this.id = id
        this.contact = contact
        this.email = email
        
    }
}