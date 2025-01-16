// App.tsx
import React, { useState } from 'react';
import { AppProvider } from './components/AppContext';
import AdminView from './components/AdminView';
import UserView from './components/UserView';

const App: React.FC = () => {
  const [view, setView] = useState<'admin' | 'user'>('admin');

  return (
    <AppProvider>
      <button onClick={() => setView(view === 'admin' ? 'user' : 'admin')}>
        Switch to {view === 'admin' ? 'User' : 'Admin'} View
      </button>
      {view === 'admin' ? <AdminView /> : <UserView />}
    </AppProvider>
  );
};

export default App;
