import * as React from 'react';
import {TableRow} from './components/TableRow';

import * as common from './common';
import {MainState, WordInfo} from './main';
export interface TimelineState {
}
export default class Timeline extends React.Component<MainState, TimelineState> {
  constructor(props, state){
    super(props, state);  
  }

  render(){
    const styles: common.Styles = {
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