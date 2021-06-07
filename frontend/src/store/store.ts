import Transaction from './transaction';
import User from './user';
import { State } from './state';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const reducer = combineReducers({
  user: User.reducer,
  transactions: Transaction.reducer
});

export const store = configureStore({
  reducer
});

store.subscribe(function () {
  State.save(store.getState());
});
