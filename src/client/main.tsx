declare var window;
declare module 'react' {
    interface HTMLProps<T> {
        onTouchTap?: React.EventHandler<React.TouchEvent<T>>;
    }
}

import * as React from 'react';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import {connect} from 'react-redux';
import {Dispatch} from 'redux';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FaceIcon from 'material-ui/svg-icons/action/face';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import {Tabs, Tab} from 'material-ui/Tabs';
import HomeIcon from 'material-ui/svg-icons/action/home';
import PersonIcon from 'material-ui/svg-icons/social/person';

import * as API from './util/api';

// import MyProfile from './myprof';
// import AddMylistDialog from './components/AddMylistDialog';
// import MyList from './mylist';
// import NewList from './newlist';

import Register from './register';
import Timeline from './timeline';
import {ETimeline} from './timeline';
import SearchBox from './components/SearchBox';
// import DialogBox from './components/DialogBox';

import {AppState} from './app';
import {IWordList, WordInfo, KeyValueItem, UserProfile, Styles} from './common';
import Constant from './constant';

import {initialize, userTimelineWithFb, userTimelineWithTw} from './redux/wordListAction';

export interface MainState {
  contents: number,
  wordList: IWordList,
  searchWord: string,
  profile: UserProfile,
  database: firebase.database.Database,
  addmylistDialogFlag: boolean,
  onAddMylist: ()=>void,
}

export interface MainProps extends AppState {
  dispatch: Dispatch<any>,
}

class Main extends React.Component<MainProps, MainState>{
  constructor(props: MainProps, state: MainState){
    super(props, state);

    // window.userId = this.userId; //TODO windowに入れない方がいいような気もする
    // window.userInfo = this.props.profile;

    const defaultWordList = [{
      id: '0',
      key: '覚えたい単語',
      value: '覚えたい意味',
      userId: null,
      userName: null,
      icon: null,
      createDate: +new Date('1989-01-01 00:00:00'),
      updateDate: +new Date('1989-01-01 00:00:00'),
    }];

    this.state = {
      //emitter,
      contents: -1,
      wordList: {
        home: [],
        user: []
      },
      searchWord: '',
      profile: this.props.profile,
      database: null,
      onAddMylist: ()=>{},
      addmylistDialogFlag: false,
    };

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
      //デフォルト全員用データの表示
      const values: any = snapshot.val();
      this.props.dispatch(initialize(values));

      // ユーザデータFirebase
      const mcctestRef: firebase.database.Reference = fbDB.ref('users/' + this.state.profile.id);
      mcctestRef.once('value', (snapshot) => { //TODO .onにしてsubscribeする？
        const values: any = snapshot.val();
        this.props.dispatch(userTimelineWithFb(values));
      });

      // ユーザデータtwitter
      if(this.state.profile.provider === 'twitter.com') {
        API.getHomeTimeline()
        .then((response: API.TweetInfo[])=>{
          this.props.dispatch(userTimelineWithTw(values));
        }).catch((err)=>{
          alert(err);
          console.log(err);
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
            <Register {...this.props} {...this.state}/>
          </div>
          <div style={styles.timeline}>
            <Tabs inkBarStyle={{background: 'white'}}>
              <Tab icon={<HomeIcon/>} style={{backgroundColor: '#fcdd6f'}} >
                <Timeline showWordList={ETimeline.HOME} {...this.props} {...this.state} />
              </Tab>
              <Tab icon={<PersonIcon/>} style={{backgroundColor: '#fcdd6f'}} >
                <Timeline showWordList={ETimeline.USER} {...this.props} {...this.state}/>
              </Tab>
            </Tabs>
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

    return (
      <div>
        <div style={styles.column}>

          <Paper zDepth={0} style={styles.titlebar}>
            {titleBar}
          </Paper>

          <div style={styles.main}>
            {page}
          </div>

        </div>
      </div>
    );
  }
}

export default connect()(Main);
