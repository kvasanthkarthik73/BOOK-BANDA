export interface User{
    _id:String;
    name:String;
    email:String;
    role:'admin'|'user';
    isActive:boolean;
    createdAt:Date;
    updatedAt:Date;
    token?: string;
}

export interface UserLogin{
    email:String;
    password:String;
}

export interface RegisterData{
    name:String;
    email:String;
    password:String;
}