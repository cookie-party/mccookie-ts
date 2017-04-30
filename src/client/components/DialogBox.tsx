import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import {MainState} from '../main';
export interface DialogProps {
  title: string,
  message: any,
  flag: boolean,
  onOK: ()=>void,
  onCancel: ()=>void,
}
export interface DialogState {
}
export default class DialogBox extends React.Component<DialogProps,DialogState>{
  constructor(props, state){
    super(props, state);
    this.state = {
      // 
    };
  }

  render() {
    const title = this.props.title || 'Dialog box';
    const message = this.props.message || 'Message';
    const flag = this.props.flag || false;

    const action = [
      <RaisedButton
        label="OK"
        primary={false}
        onTouchTap={this.props.onOK}
      />
      ,
      <FlatButton
        label="Cancel"
        primary={false}
        onTouchTap={this.props.onCancel}
      />
    ];

    return (
      <div>
        <Dialog
          title={title}
          actions={action}
          modal={true}
          open={flag}
          autoScrollBodyContent={true}
        >
          {message}
        </Dialog>
      </div>
    );
  }
}

