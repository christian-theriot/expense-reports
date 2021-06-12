import { ChangeEvent, MouseEvent, useState } from 'react';
import { Transaction, TransactionType, TRANSACTION_TYPES } from '../../store';
import * as API from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';

export interface IUpdateProps {
  id: string;
  hide: () => void;
}

export function Update(props: IUpdateProps) {
  const reference = useSelector((state: IState) =>
    state.transactions.find(txa => txa.id === props.id)
  );
  const [transaction, setTransaction] = useState<{
    date: string;
    name: string;
    amount: string;
    type: string[];
  }>({
    date: reference && reference.date ? reference.date : '',
    name: reference && reference.name ? reference.name : '',
    amount: reference && reference.amount ? `${reference.amount}` : '',
    type: reference && reference.type ? reference.type : []
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

  const onUpdate = async (e: MouseEvent) => {
    e.preventDefault();

    const amount = parseFloat(transaction.amount);
    const date = transaction.date === '' ? undefined : transaction.date;

    if (isNaN(amount)) return;

    const response = await API.Transaction.update({
      id: props.id,
      name: transaction.name,
      amount: amount,
      date,
      type: transaction.type as TransactionType[]
    });

    if (response.status === 200) {
      console.log(response);
      dispatch(
        Transaction.actions.update({
          id: props.id,
          name: transaction.name,
          amount,
          date,
          type: transaction.type as TransactionType[]
        })
      );
    }
  };

  const onCancel = (e: MouseEvent) => {
    e.preventDefault();

    props.hide();
  };

  return reference ? (
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
            <option key={idx} aria-label={`update-txa-${idx}`} value={label}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td>
        <button aria-label='update transaction' onClick={onUpdate}>
          Update Transaction
        </button>
      </td>
      <td>
        <button aria-label='cancel update' onClick={onCancel}>
          Cancel
        </button>
      </td>
    </tr>
  ) : (
    <tr>
      <td>Transaction does not exist</td>
      <td>
        <button aria-label='cancel update' onClick={onCancel}>
          Cancel
        </button>
      </td>
    </tr>
  );
}
