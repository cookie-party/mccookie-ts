import { Reducer } from "redux";
import { WordListSetAction, WordListItemAction } from './wordListAction';
import { IWordList, WordInfo } from '../common';
import {createTweetText} from '../util/utility';

const defaultWordList = [{
  id: '0',
  key: '覚えたい単語',
  value: '覚えたい意味',
  userId: null,
  userName: null,
  icon: null,
  createDate: +new Date('1989-01-01 00:00:00'),
  updateDate: +new Date('1989-01-01 00:00:00'),
}];

const defaultWordLists: IWordList = {

  home: defaultWordList,
  user: defaultWordList,
  list: defaultWordList,
}

const WordList: Reducer<any> = (state: IWordList = defaultWordLists, _action: WordListSetAction|WordListItemAction) => {
  let type: string = _action.type;
  let action;
  let wordList: IWordList;
  switch(type) {
    case 'set_home':
      action = _action as WordListSetAction;
      wordList = {
        home: action.home
          .filter((w, i, self) => self.indexOf(w) === i)
          .sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate),
        user: state.user,
        list: state.list,
      };
      return wordList;
    case 'set_user':
      action = _action as WordListSetAction;
      wordList = {
        home: state.home,
        user: action.user
          .filter((w, i, self) => self.indexOf(w) === i)
          .sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate),
        list: state.list,
      };
      return wordList;
    case 'set-list':
      action = _action as WordListSetAction;
      wordList = {
        home: state.home,
        user: state.user,
        list: action.list
          .filter((w, i, self) => self.indexOf(w) === i)
          .sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate),
      };
      return wordList;
    case 'add':
      action = _action as WordListSetAction;
      wordList = {
        home: state.home.concat(action.home)
          .filter((w, i, self) => self.indexOf(w) === i)
          .sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate),
        user: state.user.concat(action.user)
          .filter((w, i, self) => self.indexOf(w) === i)
          .sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate),
        list: state.list.concat(action.list)
          .filter((w, i, self) => self.indexOf(w) === i)
          .sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate),
      };
      return wordList;
    case 'register':
      action = _action as WordListItemAction;
      //TODO 指定されてるところに追加すべき?
      const user = state.user;
      user.push(action.item);
      const itemRegisteredWordList: IWordList = {
        home: state.home,
        user: user.sort((w1: WordInfo, w2: WordInfo)=>w2.updateDate - w1.updateDate),
        list: state.list,
      };
      return itemRegisteredWordList;
    case 'delete':
      action = _action as WordListItemAction;
      const itemDeletedWordList: IWordList = {
        home: state.home.filter((item)=> item.id !== action.item.id),
        user: state.user.filter((item)=> item.id !== action.item.id),
        list: state.list,
      };
      return itemDeletedWordList;
    default: 
      return state;
  }
};

export default WordList;