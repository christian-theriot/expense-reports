import { useSelector } from 'react-redux';
import { IState } from '../../store';

export function View() {
  const transactions = useSelector((state: IState) => state.transactions);

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
        {transactions.map((transaction, idx) => (
          <tr key={idx} aria-label={`view-txa-${idx}`}>
            <th>{transaction.date ? transaction.date : 'Pending'}</th>
            <th>{transaction.name}</th>
            <th>{transaction.amount}</th>
            <th>
              {transaction.type
                ? transaction.type.reduce((prev, cur) => `${prev ? prev + ', ' : prev}${cur}`, '')
                : ''}
            </th>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div>'No transactions to display at this time'</div>
  );
}
