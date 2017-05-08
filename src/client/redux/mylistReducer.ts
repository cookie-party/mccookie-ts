import { Reducer, Action } from "redux";
import * as _ from 'underscore';

import {Mylist} from '../common';

// export interface Mylist {
//   id: string,
//   name: string,
//   words: number[],
// }

export interface MylistState extends Array<Mylist> {
  [idx: number]: Mylist
}

export interface ListSetAction extends Action {
  mylists: Mylist[],
}

export interface ListCreateAction extends Action {
  id: string,
  name: string,
  words?: number[],
}

export interface ListInsertAction extends Action {
  id: string,
  wordId: number,
}

export interface ListRemoveAction extends Action {
  id: string,
  wordId: number,
}

export interface ListDeleteAction extends Action {
  id: string,
}

export type MylistActions = ListSetAction | ListCreateAction | ListInsertAction | ListRemoveAction | ListDeleteAction;

const defaultMylistState: MylistState = [
  {
    id: '__default',
    name: 'マイリスト',
    words: []
  }
];

const MyList: Reducer<any> = (state: MylistState = defaultMylistState, _action: MylistActions) => {
  let type: string = _action.type;
  let action;
  const current: MylistState = state;
  let list, idx = -1;
  switch(type) {
    case 'set_list':
      action = _action as ListSetAction;
      return action.mylists;
    case 'create_list':
      action = _action as ListCreateAction;
      current.push({
        id: action.id,
        name: action.name,
        words: action.words? action.words : []
      });
      return current;
    case 'delete_list':
      action = _action as ListDeleteAction;
      current.forEach((_list, i)=>{
        if(_list.id === action.id) {
          idx = i;
        }
      });
      if(idx >= 0) {
        delete current[idx];
      }
      return current;
    case 'insert_list':
      action = _action as ListInsertAction;
      current.forEach((_list, i)=>{
        if(_list.id === action.id) {
          list = _list;
          idx = i;
        }
      });
      if(list) {
        list.words = _.union(list.words, [action.wordId]);
      }
      current[idx] = list;
      return current;
    case 'remove_list':
      action = _action as ListRemoveAction;
      current.forEach((_list, i) => {
        if(_list.id === action.id) {
          list = _list;
          idx = i;
        }
      });
      if(list) {
        list.words = _.without(list.words, action.wordId);
      }
      current[idx] = list;
      return current;
    default: 
      return state;
  }
};

export default MyList;