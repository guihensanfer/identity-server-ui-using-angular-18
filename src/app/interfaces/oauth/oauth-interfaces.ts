export interface CheckEmailExistsResp{
  userExists: boolean
}

export interface CheckEmailExistsPost{
  email: string,
  enabled: boolean  
}