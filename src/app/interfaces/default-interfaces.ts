export interface RespDefault <T> {
    ticket:  string;
    message: string;
    success: boolean;
    errors:  string[];    
    data: T;
}