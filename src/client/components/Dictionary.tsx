import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {ejdic} from '../util/api';

export interface DictionaryProps {
  searchKey: string,
  flag: boolean,
  onClose: ()=>void,
  onSearched: (e)=>void,
  onClickCopy: (e)=>void,
}

export interface Cached {
  [searchWord: string]: string[]
}
export interface DictionaryState {
  searching: boolean,
  means: string[],
  meaning: string,
  meaningsAll: string,
  cached: Cached, 
}

export default class Dictionary extends React.Component<DictionaryProps, DictionaryState>{
  constructor(props, state){
    super(props, state);
    this.state = {
      searching: false,
      means: [],
      meaning: '',
      meaningsAll: '',
      cached: {},
    };
  }

  cutMeans(meanings: string): string[] {
    const means: string[] = meanings.split('/');
    return means;
  }

  onChangeRadio(e, value) {
    this.setState({meaning: value});
  }

  componentWillReceiveProps(nextProps) {
    const dialogFlag: boolean = nextProps.flag;
    const searchWord: string = nextProps.searchKey;
    if(!searchWord) { return; }

    if(this.state.cached[searchWord]){
      this.setState({means: this.state.cached[searchWord], searching: false});
    } else {
      this.setState({searching: true});
      ejdic(searchWord)
      .then((response: {result: boolean, meaning: string})=>{
        let means: string[] = [''];
        const cached = this.state.cached;
        if(response.result) {
          means = this.cutMeans(response.meaning);
          cached[searchWord] = means;
          this.props.onSearched({target:{value: means[0]}});
        }
        else {
          this.props.onSearched({target:{value: ''}});
        }
        this.setState({means: means, meaning: means[0], meaningsAll: response.meaning, cached, searching: false});
      }).catch((err)=>{
        // console.log(err);
        this.setState({meaning: null, means: [], searching: false});
      });
    }
  }

  render() {
    const styles = {
      block: {
        maxWidth: 250,
      },
      radioButton: {
        marginBottom: 16,
      },
    };

    const dialogFlag = this.props.flag;
    const searchWord = this.props.searchKey;

    const meansUl = this.state.means.map((mean, i)=>{
      return <RadioButton
        key={i}
        value={mean}
        label={mean}
        style={styles.radioButton}
      />
    });
    meansUl.push(<RadioButton
        key={Number.MAX_VALUE}
        value={this.state.meaningsAll}
        label={'All meaning'}
        style={styles.radioButton}
      />);

    let meaningView = <CircularProgress/>;
    if(!this.state.searching) {
      meaningView = (
        <div>
          <RadioButtonGroup name="means" defaultSelected="not_light" onChange={this.onChangeRadio.bind(this)}>
            {meansUl}
          </RadioButtonGroup>
        </div>
      );
    }

    const action = [
      <RaisedButton
        label="Copy"
        primary={true}
        onTouchTap={()=>{
          this.props.onClickCopy({target:{value:this.state.meaning}});
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
          autoScrollBodyContent={true}
        >
          {meaningView}
        </Dialog>
      </div>
    );
  }
}
