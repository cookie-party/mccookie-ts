import * as React from 'react';

import {connect} from 'react-redux';

import TableRow from './components/TableRow';

import {WordInfo, Styles} from './common';
import {MainState} from './main';

export enum ETimeline {
  HOME = 1,
  USER,
  LIST,
}
export interface TimelineState {
}
class Timeline extends React.Component<MainState, TimelineState> {
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

    let wordListView; 
    let kvList: WordInfo[] = [];
    const showWordList: number = this.props.showWordList;
    if(showWordList === ETimeline.HOME) {
      kvList = this.props.wordList.home;
    }
    else if(showWordList === ETimeline.USER){
      kvList = this.props.wordList.user;
    }
    else if(showWordList === ETimeline.LIST){
      kvList = this.props.wordList.list;
    }
    wordListView = kvList
      .filter((kv) => !!kv.value)
      .map((kv: WordInfo, i: number)=>{
      return (
        <div key={i}>
          <TableRow item={kv} {...this.props}/>
        </div>
      );
    });


    return (
      <div style={styles.main}>
        {wordListView}
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return ({
    wordList: state.wordList
  });
};

const mapDispatchToProps = {};

const RTimeline = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Timeline);


export default connect()(RTimeline);
