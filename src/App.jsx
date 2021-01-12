import React from 'react';
import { usePsmService } from './services/psm/PsmProvider';

function App() {
  const psmService = usePsmService();
  return (
    <div>
      <h1>{psmService.validGems}</h1>
    </div>
  );
}

export default App;
