import * as React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import DialogBox from './components/DialogBox';
import {Mylist} from './common';

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