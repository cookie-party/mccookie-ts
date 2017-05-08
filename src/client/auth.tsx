import * as React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FirebaseWrapper from './firebaseWrapper';
import {UserProfile, Styles} from './common';
import * as API from './util/api';

export interface AuthProps {
  fb: FirebaseWrapper,
  // tp: firebase.auth.TwitterAuthProvider,
  onLogin: (profile: UserProfile)=>void,
  onLogout: (userId: string)=>void,
}
export interface AuthState {
  email: string,
  password: string,
}

/**
 * Firebaseログイン
 * Twitterアカウントと紐づけてTwitter連携（自動投稿）する場合は、
 * Twitterログインにしてもらう
 * TODO Twitterログインはするけど投稿は許可しないモードをつけたほうがいいかも？
 */
export default class Auth extends React.Component<AuthProps, AuthState>{
  constructor(props, state){
    super(props, state);

    this.state = {
      email: '',
      password: '',
    }
  }

  onChangeEmail(e) {
    this.setState({email: e.target.value});
  }
  onChangePassword(e) {
    this.setState({password: e.target.value});
  }

  onUseWithoutLogin() {
    this.authenticate({
      email: 'mccookie0120@gmail.com',
      password: 'exsample',
    })
  }

  userInfoToProfileInfo(cUser: firebase.UserInfo): UserProfile {
    return {
      provider: cUser.providerId,
      id: cUser.uid,
      displayName: cUser.displayName,
      photoURL: cUser.photoURL,
    }
  }

  authenticate(user?: {email: string, password: string}) {
    let authEmail: string, authPass: string;

    if(user && user.email && user.password) {
      authEmail = user.email;
      authPass = user.password;
    }
    else {
      authEmail = this.state.email;
      authPass = this.state.password;
    }

    // 既存ユーザーのログイン機能
    this.props.fb.signIn(authEmail, authPass)
    .then((cUser)=>{
      this.props.onLogin(this.userInfoToProfileInfo(cUser));
    })
    .catch((error) => {
      alert('ログインできません（' + error.message + '）');
    });  
  }

  register() {
    // 新規ユーザーを登録
    this.props.fb.register(this.state.email, this.state.password)
    .then((cUser) => {
      this.props.onLogin(this.userInfoToProfileInfo(cUser));
    })
    .catch((error) => {
      alert('登録できません（' + error.message + '）');
    });
  }

  twitterAuth() {
    this.props.fb.signInWithTwitter()
    .then((result)=> {
      let token, secret, cUser;
      if(result && result.credential && result.user) {
        token = result.credential.accessToken;
        secret = result.credential.secret;
        cUser = result.user.providerData.length >= 0? result.user.providerData[0] : result.user;
      }
      return API.twitterAuthenticate(this.userInfoToProfileInfo(cUser), token, secret);
    }).then((response: {result: boolean, error: any, profile: UserProfile})=>{
      if(response.result) {
        this.props.onLogin(response.profile);
      }
      else{
        alert(response.error);
      }
    }).catch((error)=> {
      console.log('login failed ', error);
    });
  }

  render() {
    const styles: Styles = {
      paper: {
        width: '100%',
        height: '100%',
      },
      row: {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'center',
      },
      column: {
        display: 'flex',
        flexFlow: 'column wrap',
        justifyContent: 'center',
      },
    };
    return (
      <div id="authArea">
        <div style={styles.row}>
          <div style={styles.column}>
            <div>
              <TextField
                hintText="メールアドレス"
                onChange={this.onChangeEmail.bind(this)}
              />
            </div>
            <div>
              <TextField
                hintText="Password Field"
                floatingLabelText="Password"
                type="password"
                onChange={this.onChangePassword.bind(this)}
                />
            </div>
            <div>
              <RaisedButton label="ログイン" primary={true} onClick={this.authenticate.bind(this)} />
              <RaisedButton label="新規登録" primary={false} onClick={this.register.bind(this)} />
              <br/>
              <RaisedButton label="Twitterでログインする" primary={false} onClick={this.twitterAuth.bind(this)} />
              <br/>
              <a style = {{cursor: 'pointer'}} onClick={this.onUseWithoutLogin.bind(this)}>Loginせずに使う</a>
            </div>
          </div>
        </div>
      </div>

    );
  }
}



