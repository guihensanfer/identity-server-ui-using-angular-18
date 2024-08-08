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
  clientCallbackUrl: string
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
  userInfo: UserInfo
  operations: Operations
}

export interface UserInfo {
  userId: number
  firstName: string
  lastName: string
  email: string
  defaultLanguage: string
  picture: string | null
  projectId: number
  emailConfirmed: boolean
  enabled: boolean
  isPasswordEmpty: boolean
}

export interface Operations {
  resetPasswordQuickly: ResetPasswordQuickly
}

export interface ResetPasswordQuickly {
  code: string
}
