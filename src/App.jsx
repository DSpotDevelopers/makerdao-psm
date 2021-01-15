import React, { useEffect, useState } from 'react';
import Main from './views/main/Main';
import { usePsmService } from './services/psm/PsmProvider';

function App() {
  const psmService = usePsmService();
  // eslint-disable-next-line no-unused-vars
  const [stats, setStats] = useState(undefined);
  // eslint-disable-next-line no-unused-vars
  const [fees, setFees] = useState(undefined);
  // const [ilk, setIlk] = useState();
  useEffect(async () => {
    setStats(await psmService.getStats('USDC'));
    setFees(await psmService.getFees());
  }, []);

  return (
    <Main />
  );
}

export default App;
