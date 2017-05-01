import * as firebase from 'firebase';
import * as _ from 'underscore';
import {UserProfile, WordInfo, KeyValueItem, Mylist} from './common';

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

  // TODO subscribeもつくる
  getUserData(profile: UserProfile) : Promise<any> {
    return new Promise((resolve, reject) => {
      const userref: firebase.database.Reference = this.fb.database().ref('users/' + profile.id);
      userref.once('value', (snapshot) => { //TODO .onにしてsubscribeする？
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
      this.fb.database().ref(path + id).set(wordInfo);
      resolve();
    });
  }

  removeWordInfo(profile: UserProfile, id: string, item: WordInfo) {
    item.value = null, item.updateDate = +new Date();
    return this.pushWordInfo(profile, id, item);
  }

  deleteWordInfo(profile: UserProfile, id: string, item: WordInfo) {
    item = null;
    return this.pushWordInfo(profile, id, item);
  }

  generateListId(profile: UserProfile): string {
    const path: string = 'users/'+profile.id+'/list/';
    return this.fb.database().ref().child(path).push().key;
  }

  // TODO subscribeもつくる
  getMylist(profile: UserProfile) : Promise<any> {
    return new Promise((resolve, reject) => {
      const listRef: firebase.database.Reference = this.fb.database().ref('users/' + profile.id + '/list');
      listRef.once('value', (snapshot) => { //TODO .onにしてsubscribeする？
        const values: any = snapshot.val();
        resolve(_.values(values));
      });
    });
  }

  setMylist(profile: UserProfile, id: string, mylist: Mylist) : Promise<any> {
    return new Promise((resolve, reject) => {
      const path: string = 'users/'+profile.id+'/list/';
      this.fb.database().ref(path + id).set(mylist);
      resolve(mylist);
    });
  }

  addMylist(profile: UserProfile, id: string, addId: string): Promise<any>  {
    return new Promise((resolve, reject) => {
      const listRef: firebase.database.Reference = this.fb.database().ref('users/' + profile.id + '/list/' + id + '/words');
      listRef.once('value', (snapshot) => { //TODO .onにしてsubscribeする？
        const wordIds: string[] = snapshot.val();
        const path: string = 'users/'+profile.id+'/list/'+id+'/words/';
        let newIds: string[] = [];
        if(wordIds) {
          newIds = wordIds;
        }
        newIds.push(addId);
        this.fb.database().ref(path).set(newIds);
        resolve();
      });
    });
  }

  removeMylist(profile: UserProfile, id: string, removeId: string) {
    return new Promise((resolve, reject) => {
      const listRef: firebase.database.Reference = this.fb.database().ref('users/' + profile.id + '/list/' + id);
      listRef.once('value', (snapshot) => { //TODO .onにしてsubscribeする？
        const values: Mylist = snapshot.val();
        if(values) {
          const path: string = 'users/'+profile.id+'/list/';
          values.words = _.without(values.words, removeId);
          this.fb.database().ref(path + id).set(values);
          resolve();
        }
        else {
          resolve();
        }
      });
    });
  }

  deleteMylist(profile: UserProfile, id: string) {
    return new Promise((resolve, reject) => {
      const listRef: firebase.database.Reference = this.fb.database().ref('users/' + profile.id + '/list/' + id);
      listRef.once('value', (snapshot) => { //TODO .onにしてsubscribeする？
        const values: Mylist = snapshot.val();
        if(values) {
          const path: string = 'users/'+profile.id+'/list/';
          this.fb.database().ref(path + id).set(null);
          resolve();
        }
        else {
          resolve();
        }
      });
    });
  }

  getItemWithIdList(idlist: string[]) : Promise<any> {
    return new Promise((resolve, reject) => {
      let results = [];
      const userref: firebase.database.Reference = this.fb.database().ref('users/');
      userref.once('value', (snapshot) => { //TODO .onにしてsubscribeする？
        const values: any = snapshot.val();
        Object.keys(values).forEach((userid) => {
          idlist.forEach((wordid) => {
            if(values[userid][wordid]){
              results.push(values[userid][wordid]);
            }
          })
        });
        resolve(results);
      });
    });
  }

}

