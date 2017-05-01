import { Reducer, combineReducers } from "redux";
import wordList from './wordListReducer';
import mylist from './mylistReducer';

const mccookieApp: Reducer<any> = combineReducers({
  wordList,
  mylist
});

export default mccookieApp;