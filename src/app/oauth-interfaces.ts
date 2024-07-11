export interface RespDefault <T> {
  message: string;
  ticket: string;
  success:boolean;
  errors: [],  
  data: T;
}

export interface RespCheckEmailExists{
  userExists: boolean
}

export interface PostCheckEmailExists{
  email: string,
  enabled: boolean  
}