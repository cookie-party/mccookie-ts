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

// import MyList from './mylist';
import Register from './register';
import Timeline from './timeline';
import {ETimeline} from './timeline';
import SearchBox from './components/SearchBox';

import {AppState} from './app';
import {IWordList, WordInfo, KeyValueItem, Mylist, UserProfile, Styles} from './common';
import Constant from './constant';
import FirebaseWrapper from './firebaseWrapper';

import {homeTimeline, userTimeline, userTimelineWithTw, selectList} from './redux/wordListAction';
import {mylist, createList} from './redux/mylistAction';
import {createMylistDialog} from './mylists';

enum Status {
  close,
  opening,
  opened
}

export interface MainState {
  dispatch: Dispatch<any>,
  profile: UserProfile,
  fb: FirebaseWrapper,
  status: number,
  contents: number,
  wordList: IWordList,
  mylist: Mylist[],
  searchWord: string,
  createMylistDialogFlag: boolean,
  onAddMylist: ()=>void,
}

export interface MainProps extends AppState {
  dispatch: Dispatch<any>,
  mylist: Mylist[],
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
      dispatch: this.props.dispatch,
      profile: this.props.profile,
      fb: this.props.fb,
      status: Status.close,
      contents: -1,
      wordList: {
        home: [],
        user: []
      },
      mylist: this.props.mylist,
      searchWord: '',
      onAddMylist: ()=>{},
      createMylistDialogFlag: false,
    };

  }

  componentDidMount() {
    // firebase Database
    this.setState({
      contents: 0,
      status: Status.opening,
    });

    let wordList: WordInfo[] = [];

    const fb = this.props.fb;
    fb.getDefaults().then((vals)=>{
      this.props.dispatch(homeTimeline(vals));
      return fb.getUserData(this.state.profile);
    }).then((vals)=>{
      //ユーザタイムライン
      this.props.dispatch(userTimeline(vals));
      return fb.getMylist(this.state.profile);
    }).then((mylists)=>{
      if(mylists && mylists.length > 0) {
        this.props.dispatch(mylist(mylists));
      }
      this.setState({status: Status.opened});
    });

    if(this.state.profile.provider === 'twitter.com') {
      API.getHomeTimeline().then((response: API.TweetInfo[])=>{
        this.props.dispatch(userTimelineWithTw(response));
        this.setState({status: Status.opened});
        //TODO ツイッターのリスト使う？
      }).catch((err)=>{
        alert(err);
        console.log(err);
        this.setState({status: Status.close});
      });
    }

  }

  handleTop() {
    //ユーザ情報取得
    this.setState({contents: 0});
  }
  handleLogout() {
    this.props.onLogout(this.state.profile.id);
  }

  onAddMylist() {
    this.setState({createMylistDialogFlag: true});
  }
  onAddedMylist(name: string) {
    if(name) {
      //fb.add
      const listId = this.props.fb.generateListId(this.props.profile);
      const mylist: Mylist = {
        id: listId,
        name,
        words: []
      };
      this.props.fb.setMylist(this.props.profile, listId, mylist)
      .then((value) => {
        //redux-action
        this.props.dispatch(createList(mylist));
        this.setState({createMylistDialogFlag: false});
      }).catch((error)=>{
        alert(error.message);
        this.setState({createMylistDialogFlag: false});
      });
    }
    else {
      this.setState({createMylistDialogFlag: false});
    }
  }
  onSelectMylist(idx) {
    console.log('onSelectMylist['+idx+']', this.props.mylist);
    //redux-action
    const list = this.props.mylist[idx];
    if(list && list.words && list.words.length > 0){
      this.props.fb.getItemWithIdList(list.words)
      .then((wordInfoList: WordInfo[])=>{
        this.props.dispatch(selectList(wordInfoList));
      }).catch((err) => console.log(err));
    }
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

    const mylistMenuItems: Array<any> = this.props.mylist.map((list, i) => {
      return <MenuItem key={i} primaryText={list.name} onClick={this.onSelectMylist.bind(this, i)} />;
    });

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
            <IconMenu
            iconButtonElement={<IconButton><FolderIcon style={{cursor: 'pointer'}}/></IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            >
              {mylistMenuItems}
              <MenuItem key={-1} primaryText='Add Mylist' onClick={this.onAddMylist.bind(this)} />
            </IconMenu>
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
    if(this.state.status === Status.opened) {
      if(this.state.contents === 0){
        page = (
          <div style={styles.mainTable}>
            <div style={styles.register}>
              <Register {...this.state}/>
            </div>
            <div style={styles.timeline}>
              <Tabs inkBarStyle={{background: 'white'}}>
                <Tab icon={<HomeIcon/>} style={{backgroundColor: '#fcdd6f'}} >
                  <Timeline showWordList={ETimeline.HOME} {...this.state} />
                </Tab>
                <Tab icon={<PersonIcon/>} style={{backgroundColor: '#fcdd6f'}} >
                  <Timeline showWordList={ETimeline.USER} {...this.state}/>
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

          {createMylistDialog(this.state.createMylistDialogFlag, 
          this.onAddedMylist.bind(this) )}

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    mylist: state.mylist
  });
};

const mapDispatchToProps = {};

const RTMain = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);

export default connect()(RTMain);
