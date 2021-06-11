import { State } from './state';
import { createSlice } from '@reduxjs/toolkit';

export const User = createSlice({
  name: 'user',
  initialState: State.current.user,
  reducers: {
    setId(state, action) {
      state.id = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    setTransactions(state, action) {
      state.transactions = action.payload;
    },
    addTransaction(state, action) {
      state.transactions.push(action.payload);
    },
    removeTransaction(state, action) {
      const idx = state.transactions.findIndex(txa => txa === action.payload);

      if (idx !== -1) {
        state.transactions.splice(idx, 1);
      }
    },
    clearTransactions(state) {
      state.transactions = [];
    },
    clear(state) {
      state.id = '';
      state.username = '';
      state.transactions = [];
    }
  }
});

export default User;
