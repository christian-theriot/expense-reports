export enum TransactionType {
  Deposit = 'Deposit',
  Dog = 'Dog',
  Donation = 'Donation',
  Education = 'Education',
  Electricity = 'Electricity',
  Entertainment = 'Entertainment',
  Food = 'Food',
  Gas = 'Gas',
  Groceries = 'Groceries',
  Health = 'Health',
  Income = 'Income',
  Phone = 'Phone',
  Rent = 'Rent',
  Subscription = 'Subscription',
  Transfer = 'Transfer',
  Wifi = 'Wifi',
  Withdrawal = 'Withdrawal'
}

export const TRANSACTION_TYPES = [
  'Deposit',
  'Dog',
  'Donation',
  'Education',
  'Electricity',
  'Entertainment',
  'Food',
  'Gas',
  'Groceries',
  'Health',
  'Income',
  'Phone',
  'Rent',
  'Subscription',
  'Transfer',
  'Wifi',
  'Withdrawal'
];

export interface IUser {
  id: string;
  username: string;
  transactions: string[];
}

export interface ITransaction {
  id: string;
  name: string;
  amount: number;
  type: TransactionType[];
  date?: string;
}

export interface IState {
  user: IUser;
  transactions: ITransaction[];
}

export class State {
  static get current() {
    const state = sessionStorage.getItem('expense reports');

    if (state) {
      return JSON.parse(state) as IState;
    }

    return {
      user: {
        id: '',
        username: '',
        transactions: []
      },
      transactions: []
    } as IState;
  }

  static save(state: IState) {
    sessionStorage.setItem('expense reports', JSON.stringify(state));
  }
}
