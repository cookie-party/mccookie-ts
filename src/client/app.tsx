declare var window: any;

import * as React from 'react';
import * as RRM from 'react-responsive-mixin';

import FirebaseWrapper from './firebaseWrapper';
import cookie from 'react-cookie';
import {Store, Dispatch} from 'redux';

import {UserProfile, Styles} from './common';
import Main from './main';
import Auth from './auth';

const env = window ? window.APP_PROPS : {};

//認証済みならAPP_OAUTHに値が入る
const Profile = window ? window.APP_OAUTH : {};

export interface AppState{
//  fb: firebase.app.App,
//  tp: firebase.auth.TwitterAuthProvider,
  fb: FirebaseWrapper,
  maxHeight: number|string,
  profile: UserProfile,
  onLogin: (userProfile: UserProfile) => void,
  onLogout: (userId: string) => void,
}

export default class App extends React.Component<any, AppState>{
  constructor(props: any, state: AppState){
    super(props, state);

    // const fconf = {
    //   apiKey: env.apiKey,
    //   authDomain: env.authDomain,
    //   databaseURL: env.databaseURL,
    //   storageBucket: env.storageBucket,
    //   messagingSenderId: env.messagingSenderId,
    // };
    // const fbapp: firebase.app.App = firebase.initializeApp(fconf);
    // const tp = new firebase.auth.TwitterAuthProvider();

    this.state = {
      fb: new FirebaseWrapper(env),
      // tp,
      // config: fconf,
      maxHeight: '100%',
      profile: null,
      onLogin: this.onLogin.bind(this),
      onLogout: this.onLogout.bind(this)
    };
  }

  componentWillMount() {
    // console.log('userInfo: ', Profile);
    let profile: UserProfile = null;
    if(Profile) {
      profile = Profile;
    }
    else {
      profile = cookie.load('profile');
    }
    // console.log('componentWillMount', profile);
    this.setState({profile});
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

  onLogin (profile: UserProfile) {
    //console.log('onLogin', uid);
    this.setState({profile});
    cookie.save('profile', profile, { path: '/' });
  }

  onLogout(userId: string) {
    //console.log('onLogout');
    // this.state.fb.auth().signOut();
    this.state.fb.signOut();
    this.setState({profile: null});
    cookie.remove('profile', { path: '/' });
  }

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
