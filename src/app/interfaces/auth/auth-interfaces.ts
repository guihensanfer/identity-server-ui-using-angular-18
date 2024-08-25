export interface AuthPost {
    email:             string | null;
    projectId:         number | null;
    passwordEncrypted: string | null;
    continueWithCode: string | null;
    codePassword: string | null;
}

export interface AuthResp {
    accessToken:           string;
    accessExpiredAt:       Date;
    userInfoCode:          string;
    userInfoCodeExpiredAt: Date;
    refreshToken:          string;
    refreshExpiredAt:      Date;
}


export interface OtpPost {
    email:             string;
    projectId:         number | null; 
    resetUserPassword: boolean | null;   
}

export interface OtpResp {
    code:             string;
}

export interface ExternalGoogleResp{
    codeForRedirect: string,
    expiresAt: Date
}

export interface ResetPasswordPut {
    code:                   string;
    newPasswordEncrypted:   string;    
}

export interface ForgetPasswordPost {
    email:                string;
    clientUrl:            string;    
}