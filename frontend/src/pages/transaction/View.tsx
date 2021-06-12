import { useState } from 'react';
import { useSelector } from 'react-redux';
import { IState } from '../../store';
import { Update } from './Update';

export function View() {
  const transactions = useSelector((state: IState) => state.transactions);
  const [modifyId, setModifyId] = useState<string | undefined>(undefined);

  const show = (id: string) => setModifyId(id);
  const hide = () => setModifyId(undefined);

  return transactions.length ? (
    <table aria-label='transaction dashboard'>
      <thead>
        <tr>
          <th>Date</th>
          <th>Name</th>
          <th>Amount</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, idx) =>
          modifyId === transaction.id ? (
            <Update key={idx} id={transaction.id} hide={hide} />
          ) : (
            <tr key={idx} aria-label={`view-txa-${idx}`}>
              <td>{transaction.date ? transaction.date : 'Pending'}</td>
              <td>{transaction.name}</td>
              <td>{transaction.amount}</td>
              <td>
                {transaction.type
                  ? transaction.type.reduce((prev, cur) => `${prev ? prev + ', ' : prev}${cur}`, '')
                  : ''}
              </td>
              <td>
                <button aria-label='update' onClick={() => show(transaction.id)}>
                  Edit
                </button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  ) : (
    <div>'No transactions to display at this time'</div>
  );
}
