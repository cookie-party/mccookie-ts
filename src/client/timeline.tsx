import * as React from 'react';
import {TableRow} from './components/TableRow';

import {WordInfo, Styles} from './common';
import {MainState} from './main';

export interface TimelineState {
}
export default class Timeline extends React.Component<MainState, TimelineState> {
  constructor(props, state){
    super(props, state);  
  }

  render(){
    const styles: Styles = {
      main: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        width: '100%',
      },
    };

    const kvList = this.props.wordList.map((kv: WordInfo, i: number)=>{
      return (
        <div key={i}>
          <TableRow item={kv} emitter={this.props.emitter}/>
        </div>
      );
    });

    return (
      <div style={styles.main}>
        {kvList}
      </div>
    );
  }

}