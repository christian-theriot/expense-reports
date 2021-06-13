import { State } from './state';
import { createSlice } from '@reduxjs/toolkit';

export const User = createSlice({
  name: 'user',
  initialState: State.current.user,
  reducers: {
    setId: (state, action) => ({
      ...state,
      id: action.payload
    }),
    setUsername: (state, action) => ({
      ...state,
      username: action.payload
    }),
    setTransactions: (state, action) => ({
      ...state,
      transactions: [...action.payload]
    }),
    addTransaction: (state, action) => ({
      ...state,
      transactions: [action.payload, ...state.transactions]
    }),
    removeTransaction: (state, action) => ({
      ...state,
      transactions: state.transactions.filter(txa => txa !== action.payload)
    }),
    clearTransactions: state => ({
      ...state,
      transactions: []
    }),
    clear: () => ({
      id: '',
      username: '',
      transactions: []
    })
  }
});

export default User;
