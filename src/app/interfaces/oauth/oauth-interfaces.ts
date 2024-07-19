export interface CheckEmailExistsResp{
  userExists: boolean
}

export interface CheckEmailExistsPost{
  email: string;
  enabled: boolean  | null;
  projectId: number;
}

export interface GetContextResp {
  userId: number
  clientCallbackUri: string
  clientSecret: string
  firstName: string
  lastName: string
  defaultLanguage: string
  createdAt: string
  callbackStatus: number
  projectId: number
  projectName: string
  projectDescription: string
  projectPicture: string | null
}

export interface GetUserInfoResp {
  userId: number
  firstName: string
  lastName: string
  email: string
  defaultLanguage: string
  picture: string | null
  projectId: number
  emailConfirmed: boolean
  enabled: boolean
}