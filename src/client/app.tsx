declare var window: any;

import * as React from 'react';
import * as RRM from 'react-responsive-mixin';

// import firebase from 'firebase';
// import cookie from 'react-cookie';

//import config from './config/config';
import * as Passport from 'passport';
import {Styles} from './common';

import Main from './main';
import Auth from './auth';

const env = window ? window.APP_PROPS : {};

//認証済みならAPP_OAUTHに値が入る
const Profile = window ? window.APP_OAUTH : {};

// export interface UserInfo {
//   userId: string,
//   icon: string,
//   profile: any,
//   token: string,
//   tokenSecret: string,
// }

export interface AppState {
  maxHeight: number|string,
  profile: Passport.Profile,
  // userInfo: UserInfo,
  // onLogin: (userId: string) => void,
  // onLogout: (userId: string) => void,
}

export default class App extends React.Component<{}, AppState>{
  constructor(props: React.Props<{}>, state: AppState){
    super(props, state);

    /*
    const fconf = {
      apiKey: env.apiKey,
      authDomain: env.authDomain,
      databaseURL: env.databaseURL,
      storageBucket: env.storageBucket,
      messagingSenderId: env.messagingSenderId
    };
    */
    // const fbapp = firebase.initializeApp(fconf);

    this.state = {
      // fb: fbapp,
      // config: fconf,
      maxHeight: '100%',
      profile: null,
      // onLogin: this.onLogin.bind(this),
      // onLogout: this.onLogout.bind(this)
    };
  }

  componentWillMount() {
    console.log('userInfo: ', Profile);
    if(Profile) {
      // const oauth = Oauth.user;
      // if(oauth.token && oauth.token_secret) {
      //   const icon: string = oauth.profile.photos.length >= 0 ? oauth.profile.photos[0].value : null;
      //   const userInfo: UserInfo = Object.assign(oauth, {
      //     userId: oauth.profile.id,
      //     icon,
      //   });
      //   this.setState({ userInfo });
      // }
      this.setState({profile: Profile})
    }
  }

  componentDidMount() {
    //レスポンシブwebデザイン
    RRM.media({maxWidth: 600}, ()=> {
      this.setState({maxHeight: '100%'}); //スマホ
    });
    RRM.media({minWidth:601, maxWidth: 1024}, ()=> {
      this.setState({maxHeight: 600}); //タブレット
    });
    RRM.media({minWidth: 1025}, ()=> {
      this.setState({maxHeight: 600}); //PC
    });
  }

  // onLogin (userId) {
  //   //console.log('onLogin', uid);
  //   this.setState({userId: userId});
  //   //cookie.save('userId', userId, { path: '/' });
  // }

  // onLogout(uid) {
  //   //console.log('onLogout');
  //   //this.state.fb.auth().signOut();
  //   this.setState({userId: null});
  //   //cookie.remove('userId', { path: '/' });
  // }

  render() {
    const styles: Styles = {
      main: {},
      row: {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      },
      column: {
        display: 'flex',
        flexFlow: 'column wrap',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      },
    };
    let main = <Main {...this.state}/>;

    if (!this.state.profile) {
      main =  <Auth {...this.state} />;
    }

    return (
      <div style={styles.main}>
        <div style={styles.column}>
          {main}
        </div>
      </div>
    );
  }
}
