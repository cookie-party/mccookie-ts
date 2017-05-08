export interface Styles {
  main?: React.CSSProperties,
  paper?: React.CSSProperties,
  row?: React.CSSProperties,
  column?: React.CSSProperties,
  titlebar?: React.CSSProperties,
  mainTable?: React.CSSProperties,
  register?: React.CSSProperties,
  timeline?: React.CSSProperties,
  icon?: React.CSSProperties,
  smallIcon?: React.CSSProperties,
  tabs?: React.CSSProperties,
}

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

export interface WordInfo {
  id: string,
  key: string, 
  value: string,
  userId: string,
  userName: string,
  icon: string,
  createDate: number,
  updateDate: number,
}

export interface IWordList {
  home: WordInfo[],
  user: WordInfo[],
  list: WordInfo[],
}

export interface KeyValueItem {
  key: string,
  value: string,
}

export interface Mylist {
  id: string,
  name: string,
  words: string[],
}

