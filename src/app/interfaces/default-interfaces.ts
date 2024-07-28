export interface RespDefault <T> {
    ticket:  string;
    statusCode: number,
    message: string;
    success: boolean;
    errors:  string[];    
    data: T;
}