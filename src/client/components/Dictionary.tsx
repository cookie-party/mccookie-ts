import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import {query} from '../util/api';

export interface DictionaryProps {
  searchKey: string,
  flag: boolean,
  onClose: ()=>void,
  onDictionary: (e)=>void,
}
export interface DictionaryState {
  searching: boolean,
  meaning: string,
  cached: {}, //TODO 
}
export default class Dictionary extends React.Component<DictionaryProps, DictionaryState>{
  constructor(props, state){
    super(props, state);
    this.state = {
      searching: false,
      meaning: '',
      cached: {},
    };
  }

  componentWillReceiveProps() {
    const dialogFlag: boolean = this.props.flag;
    const searchWord: string = this.props.searchKey;
    if(!searchWord) { return; }

    if(this.state.cached[searchWord]){
      this.setState({meaning: this.state.cached[searchWord], searching: false});
    } else {
      this.setState({searching: true});
      query('ejdic', searchWord)
      .then((result: {meaning: string})=>{
        const cached = this.state.cached;
        cached[searchWord] = result.meaning;
        this.setState({meaning: result.meaning, cached: cached, searching: false});
      }).catch((err)=>{
        console.log(err);
        this.setState({meaning: '', searching: false});
      });
    }
  }

  render() {
    const dialogFlag = this.props.flag;
    const searchWord = this.props.searchKey;

    let meaningView = <CircularProgress/>;
    if(!this.state.searching) {
      meaningView = (
        <div> {this.state.meaning} </div>
      );
    }

    const action = [
      <RaisedButton
        label="Copy"
        primary={true}
        onTouchTap={()=>{
          this.props.onDictionary({target:{value:this.state.meaning}});
          this.props.onClose();
        }}
      />,
      <RaisedButton
        label="Cancel"
        primary={false}
        onTouchTap={this.props.onClose}
      />
    ];

    return (
      <div>
        <Dialog
          title={this.props.searchKey}
          actions={action}
          modal={true}
          open={dialogFlag}
        >
          {meaningView}
        </Dialog>
      </div>
    );
  }
}
