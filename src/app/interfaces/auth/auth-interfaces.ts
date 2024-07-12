export interface AuthPost {
    email:             string;
    projectId:         number;
    password:          string;
    continueWithToken: string;
}

export interface AuthResp {
    accessToken:           string;
    accessExpiredAt:       Date;
    userInfoCode:          string;
    userInfoCodeExpiredAt: Date;
    refreshToken:          string;
    refreshExpiredAt:      Date;
}
