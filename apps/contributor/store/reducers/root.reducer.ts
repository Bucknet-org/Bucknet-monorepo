import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './app.reducer';

const rootReducer = combineReducers({
  app: appReducer
});

export default rootReducer;