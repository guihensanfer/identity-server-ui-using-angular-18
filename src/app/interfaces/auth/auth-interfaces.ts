export interface AuthPost {
    email:             string;
    projectId:         number;
    password:          string;
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
