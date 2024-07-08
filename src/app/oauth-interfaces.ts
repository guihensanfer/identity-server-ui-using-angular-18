export interface RespDefault <T> {
  message: string;
  ticket: string;
  data: T;
}

export interface RespCheckEmailExists{
  exists: boolean,
  projectId: number  
}

export interface PostCheckEmailExists{
  email: string,
  enabled: boolean  
}