import * as firebase from 'firebase';
import {UserProfile, WordInfo, KeyValueItem} from './common';

export default class FirebaseWrapper {
  fb: firebase.app.App;
  tp: firebase.auth.TwitterAuthProvider;
  // db: firebase.database.Database;
  isLogined: boolean;

  constructor(env) {
    const fconf = {
      apiKey: env.apiKey,
      authDomain: env.authDomain,
      databaseURL: env.databaseURL,
      storageBucket: env.storageBucket,
      messagingSenderId: env.messagingSenderId,
    };
    this.fb = firebase.initializeApp(fconf);
    this.isLogined = false;
  }

  signIn(authEmail, authPass): Promise<firebase.UserInfo> {
    return new Promise((resolve, reject)=>{
      this.fb.auth().signInWithEmailAndPassword(authEmail, authPass)
      .then(()=>{
        const cUser: firebase.UserInfo = this.fb.auth().currentUser;
        this.isLogined = true;
        resolve(cUser);
      }).catch((error)=>{
        reject(error);
      })
    });
  }

  signInWithTwitter(): Promise<any> {
    return new Promise((resolve, reject)=>{
      this.tp = new firebase.auth.TwitterAuthProvider();
      this.tp.setCustomParameters({'lang': 'ja'});
      this.fb.auth().signInWithPopup(this.tp)
      .then(()=>{
        this.isLogined = true;
        resolve();
      }).catch(()=>{
        reject();
      });
    });
  }

  register(email, password): Promise<firebase.UserInfo> {
    return new Promise((resolve, reject)=>{
      this.fb.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        const cUser: firebase.UserInfo = this.fb.auth().currentUser;
        this.isLogined = true;
        resolve(cUser);
      }).catch((error)=>{
        reject(error);
      });
    });
  }

  signOut(): Promise<any> {
    return new Promise((resolve, reject)=>{
      this.fb.auth().signOut();
      resolve();
    });
  }

  getDefaults(): Promise<any> {
    return new Promise((resolve, reject) => {
      const mcctestRef: firebase.database.Reference = this.fb.database().ref('users/mcctest');
      mcctestRef.once('value', (snapshot) => {
        //デフォルト全員用データの表示
        const values: any = snapshot.val();
        resolve(values);
      });
    });
  }

  getUserData(profile: UserProfile) : Promise<any> {
    return new Promise((resolve, reject) => {
      const mcctestRef: firebase.database.Reference = this.fb.database().ref('users/' + profile.id);
      mcctestRef.once('value', (snapshot) => { //TODO .onにしてsubscribeする？
        const values: any = snapshot.val();
        resolve(values);
      });
    });

  }

  generateId(profile: UserProfile): string {
    const path: string = 'users/'+profile.id+'/';
    return this.fb.database().ref().child(path).push().key;
  }

  pushWordInfo(profile: UserProfile, id: string, wordInfo: WordInfo): Promise<any> {
    return new Promise((resolve, reject) => {
      const path: string = 'users/'+profile.id+'/';
      return this.fb.database().ref(path + id).set(wordInfo);
    });
  }

  deleteWordInfo(profile: UserProfile, id: string, item: WordInfo) {
    item.value = null, item.updateDate = +new Date();
    return this.pushWordInfo(profile, id, item);
  }

}

