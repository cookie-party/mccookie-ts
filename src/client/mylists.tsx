import * as React from 'react';
import {connect} from 'react-redux';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import DialogBox from './components/DialogBox';
import {Mylist} from './common';
import {MainState} from './main';
import ProfileIcon from './components/ProfileIcon';

const styles = {};

export function createMylistDialog(createMylistDialogFlag: boolean, finalize: (name?: string)=>void){
  let listName: string;
  const listNameView = (
    <TextField
      hintText="リスト名"
      onChange={ (e: any)=>{ listName = e.target.value; } }
    />
  );
  return (
    <DialogBox
      title={'マイリスト追加'}
      message={listNameView}
      flag={createMylistDialogFlag}
      onOK={()=>{
        finalize(listName);
      }}
      onCancel={() => { finalize(); } }
    />
  );
} 

export function addMylistDialog(addFolderDialog: boolean, mylist: Mylist[], select: (id?: string)=>void, onOK: ()=>void, onCancel: ()=>void) {
  let selected;
  const radios = mylist.map((list, i) => {
    return <RadioButton
        key={i}
        value={list.id}
        label={list.name}
      />;
  });
  const radioGroup = (
    <RadioButtonGroup name="addMylist" onChange={(e: any)=>{ select(e.target.value); }} defaultSelected="not_light">
      {radios}
    </RadioButtonGroup> 
  );
  return  (
    <DialogBox
      title="Select"
      message={radioGroup}
      flag={addFolderDialog}
      onOK={onOK}
      onCancel={onCancel}
    />
  );
}

export interface MylistViewProps extends MainState{
  mylist: Mylist[],
  onSelectMylist: (idx: number)=>void,
}

class _MylistView extends React.Component<MylistViewProps, any>{
  constructor(props, state) {
    super(props,state);
  }

  render() {
    const styles = {
      list: {
        //display: 'flex',
        //margin: 'auto',
        // verticalAlign: 'center',
      },
      listitem: {
        width: '90%',
        height: 100,
        color: '#FFee33',
        margin: 'auto',
        fontSize: 20,
      },
      itemBox: {
        display: 'flex', 
        height: 80, 
        backgroundColor: '#ffbb88'
      }
    }

    let listItems = this.props.mylist.map((item, i) => {
      return (
        <ListItem onClick={()=>{ this.props.onSelectMylist(i); } } key={item.id} style={styles.listitem} >
          <div style={styles.itemBox}>
            <div style={{margin: 10}}>
              <ProfileIcon src={this.props.profile.photoURL}/>
            </div>
            <div style={{margin: 10}}>
              {item.name}
            </div>
          </div>
        </ListItem>
      );
    });

    return (
      <List style={styles.list}>
        {listItems}
      </List>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    mylist: state.mylist
  });
};

const mapDispatchToProps = {};

const RMylistView = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_MylistView);

export const MylistView = connect()(RMylistView);
