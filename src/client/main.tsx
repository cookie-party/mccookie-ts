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
import * as Passport from 'passport';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FaceIcon from 'material-ui/svg-icons/action/face';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

import * as API from './util/api';

// import {getUserData} from './util/dbUtil';
// import {query, post} from './util/agent';
// import {getTweets, getUsers, getCredentials, getTimeline,
//   postTweet,getUserTimeline} from './util/agent';

// import MyProfile from './myprof';
// import AddMylistDialog from './components/AddMylistDialog';
// import MyList from './mylist';
// import NewList from './newlist';

import Register from './register';
import Timeline from './timeline';
import SearchBox from './components/SearchBox';
import DialogBox from './components/DialogBox';

import {AppState} from './app';
import * as common from './common';
import Constant from './constant';
// import {UserInfo} from './app';

export interface WordInfo {
  id: number,
  key: string, 
  value: string,
  userId: string,
  userName: string,
  icon: string,
  createDate: number,
  updateDate: number,
}

export interface KeyValueItem {
  key: string,
  value: string,
}

export interface MainState {
  emitter: EventEmitter,
  contents: number,
  wordList: WordInfo[],
  searchWord: string,
//  userInfo: UserInfo,
  profile: Passport.Profile,
  deleteDialogFlag: boolean,
  addmylistDialogFlag: boolean,
  onDeleteItem: ()=>void,
  onAddMylist: ()=>void,
}

export default class Main extends React.Component<AppState, MainState>{
  constructor(props: AppState, state: MainState){
    super(props, state);
    const emitter: EventEmitter = new EventEmitter();
    // this.userId = this.props.userId;
    // window.userId = this.userId; //TODO windowに入れない方がいいような気もする
    // window.userInfo = this.props.profile;

    this.state = {
      emitter,
      contents: -1,
      wordList: [{
        id: 0,
        key: '覚えたい単語',
        value: '覚えたい意味',
        userId: null,
        userName: null,
        icon: null,
        createDate: +new Date(),
        updateDate: +new Date(),
      }],
      searchWord: '',
      // userInfo: this.props.profile,
      profile: this.props.profile,
      onDeleteItem: ()=>{},
      onAddMylist: ()=>{},
      deleteDialogFlag: false,
      addmylistDialogFlag: false,
    };

    this.state.emitter.on('cookieRegister', (kv: KeyValueItem)=>{
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
    }).on('cookieSearch', (searchWord: string)=> {
      this.setState({searchWord});
    }).on('cookieItemDelete', (id: number)=> {
      /*
      //delete
      const wordlist: WordInfo[] = this.state.wordList;
      let deleteIdx: number = null;
      wordlist.forEach((w: WordInfo, i: number)=>{
        if(w.id === id){
          deleteIdx = i;
        }
      });
      if(deleteIdx){
        this.setState({
          deleteDialogFlag: true,
          onDeleteItem: ()=>{
            wordlist.splice(deleteIdx, 1);
          }
        });
      }
      */
    });

  }

  componentDidMount() {
    //ユーザ情報取得
    this.setState({contents: 0});
    API.getCredentials()
    .then((response: {result: boolean, err: any})=>{
      // console.log('getCredentials',result);
      if(!response.result){
        throw response.err;
      }
      return API.getUserTimeline();
    }).then((response: API.TweetInfo[])=>{
      // console.log(response);
      if(response){
        const wordList: WordInfo[] = response
        .filter((v)=>{
          return v.text.indexOf(Constant.HASHTAG) > 0 && v.text.indexOf(Constant.ATTMARK) !== 0;
        })
        .map((v)=>{
          const keyValues = v.text.split(Constant.SEPARATOR);
          return {
            id: v.id,
            key: keyValues[0],
            value: keyValues[1],
            userId: v.user.name,
            userName: v.user.screen_name,
            icon: v.user.profile_image_url,
            createDate: +new Date(v.created_at),
            updateDate: +new Date(v.created_at),
          };
        });
        this.setState({
          wordList,
          contents: 0
        });
      }
    }).catch((err)=>{
      console.log(err);
    });
  }

  handleTop() {
    //ユーザ情報取得
    this.setState({contents: 0});
  }
  handleLogout() {
    // this.props.onLogout(this.state.userId);
  }

  render() {
    const styles: common.Styles = {
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

