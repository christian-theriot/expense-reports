import { ChangeEvent, MouseEvent, useState } from 'react';
import { Transaction, TransactionType, TRANSACTION_TYPES } from '../../store';
import * as API from '../../api';
import { useDispatch } from 'react-redux';

export interface ICreateProps {
  hide: () => void;
}

export function Create(props: ICreateProps) {
  const [transaction, setTransaction] = useState<{
    date: string;
    name: string;
    amount: string;
    type: string[];
  }>({
    date: '',
    name: '',
    amount: '',
    type: []
  });
  const dispatch = useDispatch();

  const onChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
    selection?: boolean
  ) => {
    setTransaction({
      ...transaction,
      [e.target.name]: selection
        ? Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value)
        : e.target.value
    });
  };

  const onCreate = async (e: MouseEvent) => {
    e.preventDefault();

    const amount = parseFloat(transaction.amount);
    const date = transaction.date === '' ? undefined : transaction.date;

    // only allow valid values to be passed to Transaction.create
    if (isNaN(amount)) return;

    const response = await API.Transaction.create({
      name: transaction.name,
      amount,
      type: transaction.type as TransactionType[],
      date
    });

    if (response.status === 201) {
      // clear the input which is most likely to be unique
      setTransaction({
        ...transaction,
        name: '',
        amount: ''
      });
    }
  };

  const onCancel = (e: MouseEvent) => {
    e.preventDefault();

    props.hide();
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Name</th>
          <th>Amount</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input
              type='date'
              aria-label='date'
              name='date'
              value={transaction.date}
              onChange={onChange}
            />
          </td>
          <td>
            <input
              type='text'
              aria-label='name'
              name='name'
              value={transaction.name}
              onChange={onChange}
            />
          </td>
          <td>
            <input
              type='number'
              aria-label='amount'
              name='amount'
              value={transaction.amount}
              onChange={onChange}
            />
          </td>
          <td>
            <select
              multiple
              aria-label='type'
              name='type'
              value={transaction.type}
              onChange={e => onChange(e, true)}
            >
              {TRANSACTION_TYPES.map((label, idx) => (
                <option key={idx} aria-label={`create-txa-${idx}`} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </td>
          <td>
            <button aria-label='create transaction' onClick={onCreate}>
              Create Transaction
            </button>
          </td>
          <td>
            <button aria-label='cancel create' onClick={onCancel}>
              Cancel
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
