// import * as Passport from 'passport';

/**
 * 認証済み情報
 */
export interface OauthInfo {
  profile: any,
  token: string,
  token_secret: string,
}
export interface PassportSessionInfo {
  user: OauthInfo,
}


/**
 * エラー状態
 */
export interface ErrorStatus extends Error {
  status: number,
}