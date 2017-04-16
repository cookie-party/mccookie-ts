import { Reducer, combineReducers } from "redux";
import wordList from './wordListReducer';

const mccookieApp: Reducer<any> = combineReducers({
  wordList,
});

export default mccookieApp;