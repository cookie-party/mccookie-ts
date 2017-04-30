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
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import DialogBox from './DialogBox';

import IconView from './IconView';
import WordPaper from './WordPaper';

import {WordInfo} from '../common';

import {deleteItem} from '../redux/wordListAction';
import * as API from '../util/api';

import {AppState} from '../app';

export interface TableRowProps extends AppState{
  item: WordInfo,
  // emitter: EventEmitter,
}

interface ReduxTableRowProps extends TableRowProps {
  dispatch: Dispatch<any>
}

export interface TableRowState {
  deleteDialogFlag: boolean;
  addFolderDialog: boolean;
} 

//TODO 画像も表示する
class TableRow extends React.Component<ReduxTableRowProps, TableRowState> { 
  constructor(props, state){
    super(props,state);

    this.state = {
      deleteDialogFlag: false,
      addFolderDialog: false,
    }

  }

  // onReply() {
  //   console.log('onReply');
  // }

  onAddMyList() {
    console.log('onAddMyList');
    this.setState({addFolderDialog: true});
  }

  onSelectList(e, selected) {
    console.log('selected', selected);
  }

  onSelectedAddMyList() {
    console.log('onSelectedAddMyList');
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
      icon: {
        width: 50,
        height: 50,
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
      smallIcon: {
        width: 20,
        height: 20,
        fill: '#42AFE3', //d0d8e5
        cursor: 'pointer',
      }, 
    };

    const item: WordInfo = this.props.item;

    const icon = item.icon || '../../static/img/satomi.jpg';
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

    const iconlist = (
      <div style={styles.row}>
        <div style={{margin: 5}}>
          <IconView icon={LibraryAddIcon} style={styles.smallIcon} onClick={this.onAddMyList.bind(this)}/>
        </div>
        <div style={{margin: 5}}>
          <IconView icon={DeleteIcon} style={styles.smallIcon} onClick={this.onDelete.bind(this)}/>
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

    const radios = [];
    for (let i = 0; i < 30; i++) {
      radios.push(
        <RadioButton
          key={i}
          value={`value${i + 1}`}
          label={`Option ${i + 1}`}
          style={styles.radioButton}
        />
      );
    }
    const radioGroup = (
      <RadioButtonGroup name="shipSpeed" onChange={this.onSelectList.bind(this)} defaultSelected="not_light">
        {radios}
      </RadioButtonGroup> 
    );

    const dialogs = (
      <div>
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
          <DialogBox
            title="Select"
            message={radioGroup}
            flag={this.state.addFolderDialog}
            onOK={this.onSelectedAddMyList.bind(this)}
            onCancel={()=>{
              this.setState({addFolderDialog: false})
            }}
          />
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
            <img src={icon} style={styles.icon}/>
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

export default connect()(TableRow);

