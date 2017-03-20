import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
// import {authenticate} from './util/agent';
import {Styles} from './common';

export default class Auth extends React.Component<{}, {}>{
  constructor(props, state){
    super(props, state);
  }

  render() {
    const styles: Styles = {
      paper: {
        width: '100%',
        height: '100%',
      },
      row: {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'center',
      },
      column: {
        display: 'flex',
        flexFlow: 'column wrap',
        justifyContent: 'center',
      },
    };
    return (
      <div id="authArea">
        <div style={styles.row}>
          <div style={styles.column}>
            <a href='/api/v1/twitter/auth'>Login</a>
          </div>
        </div>
      </div>
    );
  }
}



