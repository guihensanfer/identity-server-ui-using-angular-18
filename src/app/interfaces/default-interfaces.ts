export interface RespDefault <T> {
    message: string;
    ticket: string;
    success:boolean;
    errors: [],  
    data: T;
}