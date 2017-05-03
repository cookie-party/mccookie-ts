import * as React from 'react';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {EventEmitter} from 'eventemitter3';
import * as moment from 'moment';

import StarIcon from 'material-ui/svg-icons/toggle/star';
import LibraryAddIcon from 'material-ui/svg-icons/av/library-add';
import ReplyIcon from 'material-ui/svg-icons/content/reply';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

import DialogBox from './DialogBox';

import IconView from './IconView';
import WordPaper from './WordPaper';

import {WordInfo} from '../common';

import {deleteItem} from '../redux/wordListAction';
import * as API from '../util/api';

import {AppState} from '../app';
import {addMylistDialog} from '../mylists';
import {MainState} from '../main';

import {ETimeline} from '../timeline';
import {removeList} from '../redux/mylistAction';
import {Mylist} from '../common';
import ProfileIcon from './ProfileIcon';

export interface TableRowProps extends MainState{
  item: WordInfo,
  // emitter: EventEmitter,
}

interface ReduxTableRowProps extends TableRowProps {
  dispatch: Dispatch<any>,
  mylist: Mylist[],
}

export interface TableRowState {
  deleteDialogFlag: boolean;
  removeListDialogFlag: boolean;
  addFolderDialog: boolean;
  selectedId: string;
} 

//TODO 画像も表示する
class TableRow extends React.Component<ReduxTableRowProps, TableRowState> { 
  constructor(props, state){
    super(props,state);

    this.state = {
      deleteDialogFlag: false,
      removeListDialogFlag: false,
      addFolderDialog: false,
      selectedId: null,
    }

  }

  // onReply() {
  //   console.log('onReply');
  // }

  onAddMyList() {
    this.setState({addFolderDialog: true});
  }

  onSelectList(selected) {
    this.setState({selectedId: selected})
  }

  onSelectedAddMyList() {
    //fb-
    this.props.fb.addMylist(this.props.profile, this.state.selectedId, this.props.item.id);
    alert(this.props.item.key+'のカードを追加しました.');
    //TODO reloadしたくない
    location.reload();
  }

  // onLike() {
  //   console.log('onLike');
  // }

  onDelete() {
    // console.log('onDelete', this.props.item);
    this.setState({deleteDialogFlag: true});
  }
  onDeleteApproved() {
    this.props.dispatch(deleteItem(this.props.profile, this.props.fb, this.props.item));
    this.setState({deleteDialogFlag: false});
  }

  onRemoveList() {
    this.setState({removeListDialogFlag: true});
  }
  onRemoveListApproved() {
    this.props.fb.removeMylist(this.props.profile, this.props.listId, this.props.item.id)
    .then(()=>{
      this.props.dispatch(removeList(this.props.listId, this.props.item.id));
      this.setState({removeListDialogFlag: false});
    }).catch((err)=>{
      alert(err);
      this.setState({removeListDialogFlag: false});
    });
  }

  render() {
    const styles: any = {
      row: {
        display: 'flex',
      },
      column: {
        display: 'flex',
        flexFlow: 'column wrap',
        justifyContent: 'center',
      },
      header: {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'center',
      },
      username: {
        flexGrow: 3,
        fontSize: '12pt',
        fontWeight: 'bold',
        margin: 5,
      },
      userid: {
        flexGrow: 0,
        fontSize: '5pt',
        margin: 5,
      },
      time: {
        flexGrow: 0,
        fontSize: '5pt',
        margin: 5,
      },
    };

    const item: WordInfo = this.props.item;

    const username = item.userName || 'satomi';
    const userid = '@'+item.userId || '@satomi';

    let time = '';
    const now = moment();
    if(item.createDate){
      const day = now.diff(moment(item.createDate), 'days');
      const hour = now.diff(moment(item.createDate), 'hours');
      const minute = now.diff(moment(item.createDate), 'minutes');
      const second = now.diff(moment(item.createDate), 'seconds');
      if(day !== 0) {
        time += day + ' days';
      } else if(hour !== 0) {
        time += hour + ' hours';
      } else if(minute !== 0) {
        time += minute + ' minutes';
      } else if(second !== 0) {
        time += second + ' seconds';
      }
    }

    let deleteIconView = null;
    if(this.props.showWordList === ETimeline.USER) {
      deleteIconView = <IconView icon={DeleteIcon} style={styles.smallIcon} onClick={this.onDelete.bind(this)}/>
    }
    else if(this.props.showWordList === ETimeline.LIST) {
      deleteIconView = <IconView icon={DeleteIcon} style={styles.smallIcon} onClick={this.onRemoveList.bind(this)}/>
    }


    const iconlist = (
      <div style={styles.row}>
        <div style={{margin: 5}}>
          <IconView icon={LibraryAddIcon} style={styles.smallIcon} onClick={this.onAddMyList.bind(this)}/>
        </div>
        <div style={{margin: 5}}>
          {deleteIconView}
        </div>
      </div>
    );

    /** TODO
        <div style={{margin: 5}}>
          <IconView icon={ReplyIcon} style={styles.smallIcon} onClick={this.onReply.bind(this)}/>
        </div>
        <div style={{margin: 5}}>
          <IconView icon={StarIcon} style={styles.smallIcon} onClick={this.onLike.bind(this)}/>
        </div>
     * 
     */

    const content = (
      <div style={styles.column}>
        <div style={styles.header}>
          <div style={styles.username}>
            {username}
          </div>
          <div style={styles.userid}>
            {userid}
          </div>
          <div style={styles.time}>
            {time}
          </div>
        </div>
        <WordPaper {...this.props}/>
        <div style={styles.row}>
          {iconlist}
        </div>
      </div>
    );

    const dialogs = (
      <div>
        <div>
          <DialogBox
            title={'Remove Item From List'}
            message={'単語をリストから削除しますか？'}
            flag={this.state.removeListDialogFlag}
            onOK={this.onRemoveListApproved.bind(this)}
            onCancel={()=>{
              this.setState({removeListDialogFlag: false});
            }}
          />
        </div>
        <div>
          <DialogBox
            title={'Delete Item'}
            message={'単語を削除しますか？'}
            flag={this.state.deleteDialogFlag}
            onOK={this.onDeleteApproved.bind(this)}
            onCancel={()=>{
              this.setState({deleteDialogFlag: false});
            }}
          />
        </div>
        <div id='AddMyListDialog'>
          {addMylistDialog(this.state.addFolderDialog, 
          this.props.mylist,
          (id)=>{ this.onSelectList(id); },
          ()=>{ this.onSelectedAddMyList(); this.setState({addFolderDialog: false}); },
          ()=>{ this.setState({addFolderDialog: false}); }
          )}
        </div>
      </div>
    );
    
    return (
      <ReactCSSTransitionGroup
          transitionName="animation"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnter={true}
          transitionEnterTimeout={500}
          transitionLeave={true}
          transitionLeaveTimeout={500}
          >
        <div style={styles.row}>
          <div style={{flexGrow: 0, margin: 10}}>
            <ProfileIcon src={item.icon}/>
          </div>
          <div style={{flexGrow: 1, margin: 10}}>
            {content}
          </div>
        </div>
        <div>
          {dialogs}
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    mylist: state.mylist
  });
};

const mapDispatchToProps = {};

const RTableRow = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TableRow);

export default connect()(RTableRow);

