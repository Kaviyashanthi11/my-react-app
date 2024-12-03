import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './Top/UserContext';
import { PracticeProvider } from './PracticeContext'; // Import PracticeProvider
import AppRoutes from './routes';

const App = () => {
  return (
    <BrowserRouter basename="my-react-app">
      <UserProvider>
        <PracticeProvider> {/* Wrap the context around the app */}
          <AppRoutes />
        </PracticeProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
