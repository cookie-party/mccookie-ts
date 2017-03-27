declare var window;
declare module 'react' {
    interface HTMLProps<T> {
        onTouchTap?: React.EventHandler<React.TouchEvent<T>>;
    }
}

import * as React from 'react';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import {EventEmitter} from 'eventemitter3';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FaceIcon from 'material-ui/svg-icons/action/face';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

import * as API from './util/api';

// import MyProfile from './myprof';
// import AddMylistDialog from './components/AddMylistDialog';
// import MyList from './mylist';
// import NewList from './newlist';

import Register from './register';
import Timeline from './timeline';
import SearchBox from './components/SearchBox';
import DialogBox from './components/DialogBox';

import {AppState} from './app';
import {WordInfo, KeyValueItem, UserProfile, Styles} from './common';
import Constant from './constant';

export interface MainState {
  emitter: EventEmitter,
  contents: number,
  wordList: WordInfo[],
  searchWord: string,
  profile: UserProfile,
  database: firebase.database.Database,
  deleteDialogFlag: boolean,
  addmylistDialogFlag: boolean,
  onDeleteItem: ()=>void,
  onAddMylist: ()=>void,
}

export default class Main extends React.Component<AppState, MainState>{
  constructor(props: AppState, state: MainState){
    super(props, state);
    const emitter: EventEmitter = new EventEmitter();
    // window.userId = this.userId; //TODO windowに入れない方がいいような気もする
    // window.userInfo = this.props.profile;

    this.state = {
      emitter,
      contents: -1,
      wordList: [{
        id: '0',
        key: '覚えたい単語',
        value: '覚えたい意味',
        userId: null,
        userName: null,
        icon: null,
        createDate: +new Date('1989-01-01 00:00:00'),
        updateDate: +new Date('1989-01-01 00:00:00'),
      }],
      searchWord: '',
      profile: this.props.profile,
      database: null,
      onDeleteItem: ()=>{},
      onAddMylist: ()=>{},
      deleteDialogFlag: false,
      addmylistDialogFlag: false,
    };

    this.state.emitter.on('cookieRegister', (kv: KeyValueItem)=>{
      // console.log('register profile', this.props.profile);

      if(this.props.profile.provider === 'twitter.com') {
        const kvtext: string = kv.key + Constant.SEPARATOR + kv.value + Constant.SEPARATOR + Constant.HASHTAG;
        API.postTweet(kvtext)
        .then((response: any)=>{
          // console.log('response',response);
          if(response && response.statusCode === 200) {
            console.log('success!');
            location.reload();
          }
        }).catch((err: string)=>{
          console.log(err);
        });
      }
      else if(this.props.profile.provider === 'firebase') {
        const testUserPath: string = 'users/'+this.props.profile.id+'/';
        const keyid: string = this.state.database.ref().child(testUserPath).push().key;
        const newData: WordInfo = {
          id: keyid,
          key: kv.key,
          value: kv.value,
          userId: this.state.profile.id,
          userName: this.state.profile.displayName,
          icon: this.state.profile.photoURL,
          createDate: +new Date(),
          updateDate: +new Date(),        
        };
        this.state.database.ref(testUserPath + keyid).set(newData)
        .then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        });
      }

    }).on('cookieSearch', (searchWord: string)=> {
      this.setState({searchWord});

    }).on('cookieItemDelete', (id: string)=> {
      //delete
      const wordlist: WordInfo[] = this.state.wordList;
      let deleteIdx: number = null, target: WordInfo = null;
      wordlist.forEach((w: WordInfo, i: number)=>{
        if(w.id === id){
          deleteIdx = i;
          target = w;
          target.value = null;
          target.updateDate = +new Date();
        }
      });
      if(typeof deleteIdx === 'number'){
        this.setState({
          deleteDialogFlag: true,
          onDeleteItem: ()=>{
            wordlist.splice(deleteIdx, 1);

            if(this.props.profile.provider === 'twitter.com') {
              API.deleteItem(id).then(()=>{
                this.setState({wordList: wordlist, deleteDialogFlag: false});
              }).catch((err)=>{
                alert(err);
                this.setState({deleteDialogFlag: false});
              });
            }
            else if(this.props.profile.provider === 'firebase'){
              this.props.fb.database().ref('/users/'+this.props.profile.id)
              .set(target)
              .then((result) => {
                console.log(result);
                this.setState({wordList: wordlist, deleteDialogFlag: false});
              })
              .catch((err) => {
                console.log(err);
                alert(err);
                this.setState({deleteDialogFlag: false});
              });
            }

          }
        });
      }
    });

  }

  componentDidMount() {
    // firebase Database
    const fbDB: firebase.database.Database = this.props.fb.database();
    this.setState({
      contents: 0,
      database: fbDB,
    });

    let wordList: WordInfo[] = [];

    //mccookite db data
    const mcctestRef: firebase.database.Reference = fbDB.ref('users/mcctest');
    mcctestRef.once('value', (snapshot) => {
      const values: any = snapshot.val();
      if(values) {
        const vKeyids: string[] = Object.keys(values);
        const preWordList: WordInfo[] = this.state.wordList;
        const nextWordList: WordInfo[] = vKeyids.map((keyid) => {
          return values[keyid];
        });

        wordList = preWordList.concat(nextWordList)
        .sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate);

        this.setState({wordList: wordList});
      }

      //ユーザ情報取得
      if(this.state.profile.provider === 'twitter.com') {
        API.getUserTimeline()
        .then((response: API.TweetInfo[])=>{
          if(response){
            const preWordList: WordInfo[] = this.state.wordList;
            const nextWordList: WordInfo[] = response
            .filter((v)=>{
              return v.text.indexOf(Constant.HASHTAG) > 0 && v.text.indexOf(Constant.ATTMARK) !== 0;
            })
            .map((v)=>{
              const keyValues = v.text.split(Constant.SEPARATOR);
              return {
                id: v.id_str,
                key: keyValues[0],
                value: keyValues[1],
                userId: v.user.name,
                userName: v.user.screen_name,
                icon: v.user.profile_image_url,
                createDate: +new Date(v.created_at),
                updateDate: +new Date(v.created_at),
              };
            });
            wordList = preWordList.concat(nextWordList)
            .sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate);
            this.setState({wordList: wordList});
          }
        }).catch((err)=>{
          console.log(err);
        });

      } else if(this.state.profile.provider === 'firebase') {
        //TODO my wordlist
        const mcctestRef: firebase.database.Reference = fbDB.ref('users/' + this.state.profile.id);
        mcctestRef.on('value', (snapshot) => {
          const values: any = snapshot.val();
          if(values) {
            const vKeyids: string[] = Object.keys(values);
            const preWordList: WordInfo[] = this.state.wordList;
            const nextWordList: WordInfo[] = vKeyids
            .filter((kid) => {
              let _notExist: boolean = true;
              preWordList.forEach((w: WordInfo) => {
                if(w.id === kid) {
                  _notExist = false;
                }
              });
              return _notExist;
            })
            .map((keyid) => {
              return values[keyid];
            });
            wordList = preWordList.concat(nextWordList)
            .sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate);
            this.setState({wordList: wordList});
          }
        });
      }

    });
  }

  handleTop() {
    //ユーザ情報取得
    this.setState({contents: 0});
  }
  handleLogout() {
    this.props.onLogout(this.state.profile.id);
  }

  render() {
    const styles: Styles = {
      column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '100%'
      },
      row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      },
      titlebar: {
        border : '.5px solid',
        borderColor: '#fcefd6',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%'
      },
      main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: this.props.maxHeight, 
        padding: 50,
      },
      mainTable: {
        border : '.5px solid',
        borderColor: '#fcefd6',
        backgroundColor: '#fffcfc',
        margin: '10 auto',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
      },
      register: {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        width: '90%',
        margin: 30
      },
      timeline: {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        width: '90%',
      },
    };

    const titleBar = (
      <div style={styles.row}>
        <div style={{width: 250, height: 40, display: 'flex', justifyContent: 'space-around'}}>
          <img src='../static/img/title_logo.png' style={{cursor: 'pointer'}} width='70%' onTouchTap={this.handleTop.bind(this)}/>
        </div>
        <div>
          <SearchBox {...this.state}/>
        </div>
        <div style={{width: 150, display: 'flex'}}>
          <div style={{display: 'flex',  justifyContent: 'center', flexDirection: 'column',}}>
            <FolderIcon style={{cursor: 'pointer'}}/>
          </div>
          <div style={{margin: 10}}>
            <IconMenu
            iconButtonElement={<IconButton><FaceIcon /></IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            >
              <MenuItem primaryText='MyProfile' ></MenuItem>
              <MenuItem primaryText='logout' onClick={this.handleLogout.bind(this)} ></MenuItem>
            </IconMenu>
          </div>
        </div>
      </div>
    );

    let page = <CircularProgress/>;
    if(this.state.contents === 0){
      page = (
        <div style={styles.mainTable}>
          <div style={styles.register}>
            <Register {...this.state}/>
          </div>
          <div style={styles.timeline}>
            <Timeline {...this.state}/>
          </div>
        </div>
      );
    }
    else if(this.state.contents === 1){
      // page = <MyProfile {...this.state}/>;
    }
    else if(this.state.contents === 2){
      // page = <MyList {...this.state}/>;
    }
    else if(this.state.contents === 3){
      // page = <NewList {...this.state} />;
    }

    const dialogs = (
      <div>
        <div>
          <DialogBox
            title={'Delete Item'}
            message={'単語を削除しますか？'}
            flag={this.state.deleteDialogFlag}
            onOK={this.state.onDeleteItem.bind(this)}
            onCancel={()=>{
              this.setState({deleteDialogFlag: false});
            }}
          />
        </div>
        <div id='AddMyListDialog'>
        </div>
      </div>
    );

    return (
      <div>
        <div style={styles.column}>

          <Paper zDepth={0} style={styles.titlebar}>
            {titleBar}
          </Paper>

          <div style={styles.main}>
            {page}
          </div>

          <div>
            {dialogs}
          </div>

        </div>
      </div>
    );
  }
}

