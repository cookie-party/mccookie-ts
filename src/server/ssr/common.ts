/**
 * 認証済み情報
 */
export interface OauthInfo {
  profile: any,
  token: string,
  token_secret: string,
}

export interface UserProfile {
  provider: string,
  id: string;
  displayName: string;
  photoURL: string;
}

/**
 * エラー状態
 */
export interface ErrorStatus extends Error {
  status: number,
}