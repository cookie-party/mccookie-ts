import * as React from 'react';
import TextField from 'material-ui/TextField';

import {MainState} from '../main';
export interface SearchBoxState {
}
export default class SeachBox extends React.Component<MainState, SearchBoxState> {
  constructor(props, state){
    super(props, state);  
  }

  onChangeSearchWord(e) {
    // this.props.emitter.emit('cookieSearch', e.target.value);
  }

  render() {
    const style: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
    };
    return (
      <div style={style}>
        <TextField
          hintText="検索"
          onChange={this.onChangeSearchWord.bind(this)}
        />
      </div>
    );
  }

}