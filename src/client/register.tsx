import * as React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {registerItem} from './redux/wordListAction';

import SchoolIcon from 'material-ui/svg-icons/social/school';
import AddPhotoIcon from 'material-ui/svg-icons/image/add-a-photo';
import LabelOutlineIcon from 'material-ui/svg-icons/action/label-outline';

import IconView from './components/IconView';
import Dictionary from './components/Dictionary';
// import AddTag from './components/AddTag';

import * as common from './common';
import Constant from './constant';

import {MainState} from './main';
export interface RegisterState {
  key: string,
  value: string,
  focused: boolean,
  openDictionary: boolean,
  openAddTag: boolean,
  errorflag: boolean,
  errorText: string,
}

interface RegisterProps extends MainState{
  dispatch: Dispatch<any>
}

class Register extends React.Component<RegisterProps, RegisterState> {
  constructor(props, state){
    super(props, state);  
    this.state = {
      key: '',
      value: '',
      focused: false,
      openDictionary: false,
      openAddTag: false,
      errorflag: false,
      errorText: 'over 130 characters',
    };
  }

  onFocusRegister() {
    this.setState({focused: true});
  }
  onUnfocusRegister() {
    if(!this.state.key){
      this.setState({focused: false});
    }
  }

  onChangeKey(e) {
    this.setState({key: e.target.value});
  }
  onChangeValue(e) {
    let errorflag = false;
    const value = e.target.value;
    //タグ抽出
    let tagStr = '', tagList = [];
    if(value.indexOf('#')>0) {
      tagStr = value.substring(value.indexOf(' #'));
      const wspace: string = new String('\u3000') as string;
      tagStr = tagStr.replace( wspace , ' ' ) ;
      tagStr = tagStr.replace( '\n' , ' ' ) ;
      if(tagStr){
        tagList = tagStr.split(' ');
      }
      tagList = tagList.filter((tag)=>{
        if(tag.indexOf('#')>=0){
          return tag;
        }
      });
    }
    const keyValue = this.state.key + Constant.SEPARATOR + value;
    //100文字制限
    if(keyValue.length > 130) {
      errorflag = true;
    }
    this.setState({value, errorflag});
  }
  onClickRegister(e){
    this.props.dispatch(registerItem(this.props.profile, this.props.fb, this.state));
    this.setState({key: '', value: '', focused: false});
    // this.props.emitter.emit('cookieRegister', this.state);
  }

  onDictionary() {
    this.setState({openDictionary: !this.state.openDictionary});
  }
  onAddTag() {
    this.setState({openAddTag: !this.state.openAddTag});
  }

  // onAddPhoto() {
  //   console.log('onAddPhoto');
  // }

  render(){
    const styles: common.Styles = {
      main: {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'center',
        width: '100%',
      },
      row: {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'center',
        //alignItems: 'baseline',
      },
      column: {
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'center',
        alignItems: 'flex-end',
      },
      icon: {
        width: 50,
        height: 50
      },
      smallIcon: {
        width: 30,
        height: 30,
        fill: '#42AFE3',
        cursor: 'pointer',
      }, 
    };

    //const icon = this.props.profile.icon || '../img/satomi.jpg';
    const icon: string = this.props.profile.photoURL;

    const wordInput = (
      <div style={styles.row}
        onFocus={this.onFocusRegister.bind(this)}
        onBlur={this.onUnfocusRegister.bind(this)}
      >
        <div style={{margin: 10}}>
          <TextField
          hintText='単語'
          value={this.state.key}
          onChange={this.onChangeKey.bind(this)}
          multiLine={true}
          rows={1}
          rowsMax={2}
          errorText={this.state.errorflag? this.state.errorText: null}
          autoFocus={this.state.focused}
          />
        </div>
        <div style={{margin: 20}}>
          <IconView icon={SchoolIcon} style={styles.smallIcon} onClick={this.onDictionary.bind(this)}/>
          <Dictionary
           searchKey={this.state.key}
           flag={this.state.openDictionary}
           onClose={this.onDictionary.bind(this)} 
           onSearched={this.onChangeValue.bind(this)}
           onClickCopy={this.onChangeValue.bind(this)}/>
        </div>
      </div>
    );

    const registerMainView = (
      <div>
          {wordInput}
          <div style={{width: '70%'}}>
            <div style={{margin: 10}}>
                <TextField
                hintText="意味"
                value={this.state.value}
                onChange={this.onChangeValue.bind(this)}
                multiLine={true}
                rows={1}
                rowsMax={3}
                errorText={this.state.errorflag? this.state.errorText: null}
                />
            </div>
          </div>
          <div style={styles.row}>
            <div style={{margin: 20}}>
              <IconView icon={LabelOutlineIcon} style={styles.smallIcon} onClick={this.onAddTag.bind(this)}/>
              <div id='AddTag'/>
            </div>
            <div style={{margin: 20}}>
              <RaisedButton label="登録" disabled={this.state.errorflag} primary={true} onClick={this.onClickRegister.bind(this)} />
            </div>
          </div>
        </div>
    );

            /*<div style={{margin: 20}}>
              <IconView icon={AddPhotoIcon} style={styles.smallIcon} onClick={this.onAddPhoto.bind(this)}/>
            </div>*/


    let registerView = <div/>;
    if(this.state.focused){
      registerView = registerMainView;
    }
    else {
      registerView = wordInput;
    }

    return (
      <div style={styles.main}>
        <div style={{width: 50, margin: 10}}>
            <img src={icon} style={styles.icon}/>
        </div>
        <div style={styles.column}>
          {registerView}
        </div>
      </div>
    );
  }

}

export default connect()(Register);