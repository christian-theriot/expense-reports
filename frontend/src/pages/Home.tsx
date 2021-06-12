import { useState } from 'react';
import { View, Create } from './transaction';

export function Home() {
  const [creating, setCreating] = useState<boolean>(false);

  return (
    <>
      {creating ? (
        <Create
          hide={() => {
            setCreating(false);
          }}
        />
      ) : (
        <button aria-label='create new transaction' onClick={() => setCreating(true)}>
          New...
        </button>
      )}
      <View />
    </>
  );
}
