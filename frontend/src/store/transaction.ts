import { State } from './state';
import { createSlice } from '@reduxjs/toolkit';

export const Transaction = createSlice({
  name: 'transactions',
  initialState: State.current.transactions,
  reducers: {
    set(state, action) {
      state.splice(0, state.length, ...action.payload);
    },
    add(state, action) {
      state.push(action.payload);
    },
    remove(state, action) {
      const idx = state.findIndex(txa => txa.id === action.payload);

      if (idx !== -1) {
        state.splice(idx, 1);
      }
    },
    clear(state) {
      state.splice(0, state.length);
    },
    update(state, action) {
      const idx = state.findIndex(txa => txa.id === action.payload.id);

      if (idx !== -1) {
        if (action.payload.name) {
          state[idx].name = action.payload.name;
        }

        if (action.payload.amount) {
          state[idx].amount = action.payload.amount;
        }

        state[idx].date = action.payload.date;
        state[idx].type = action.payload.type;
      }
    }
  }
});

export default Transaction;
