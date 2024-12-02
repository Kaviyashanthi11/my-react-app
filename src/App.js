import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './Top/UserContext';
import { PracticeProvider } from './PracticeContext'; // Import PracticeProvider
import AppRoutes from './routes';

const App = () => {
  return (
    // Set basename to the subdirectory where your app is deployed
    <BrowserRouter basename="/Availity02">
      <UserProvider>
        <PracticeProvider> {/* Wrap the context around the app */}
          <AppRoutes />
        </PracticeProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
