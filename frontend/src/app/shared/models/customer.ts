export interface Customer{
    uid: string;
    userName: string;
    email: string;
    address?:string;
    phone?: bigint;
    status: string;
    remarks: string;
   
}