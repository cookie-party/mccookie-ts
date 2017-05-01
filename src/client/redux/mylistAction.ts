import {Action} from 'redux';
import * as _ from 'underscore';
import {Mylist} from '../common';
import {ListSetAction, ListCreateAction, ListInsertAction, ListRemoveAction, ListDeleteAction} from './mylistReducer';

export function mylist(mylists: Mylist[]): ListSetAction{
  return {
    type: 'set_list',
    mylists,
  };
};

export function createList(mylist: Mylist): ListCreateAction {
  return  _.extend({type: 'create_list'}, mylist);   
}

export function insertList(id: string, wordId: number): ListInsertAction {
  return _.extend({type: 'insert_list', ...arguments});
}

export function removeList(id: string, wordId: number): ListRemoveAction {
  return _.extend({type: 'remove_list', ...arguments});
}

export function deleteList(id: string): ListDeleteAction {
  return _.extend({type: 'delete_list', ...arguments});
}


