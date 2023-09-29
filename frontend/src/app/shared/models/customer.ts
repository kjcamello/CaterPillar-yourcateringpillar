export interface Customer{
    uid: string;
    userName: string;
    email: string;
    IsVerified: boolean;
    address?:string;
    phone?: bigint;
   
}