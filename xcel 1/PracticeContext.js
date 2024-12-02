// PracticeContext.js
import React, { createContext, useState, useContext } from 'react';

const PracticeContext = createContext();

export const PracticeProvider = ({ children }) => {
  const [practiceInfo, setPracticeInfo] = useState(() => {
    // Initialize from sessionStorage if available
    const storedPractice = sessionStorage.getItem('selectedPractice');
    return storedPractice ? JSON.parse(storedPractice) : { label: '', value: '', practiceCode: '' };
  });

  const updatePractice = (practice) => {
    setPracticeInfo(practice);
    // Also update sessionStorage when practice changes
    sessionStorage.setItem('selectedPractice', JSON.stringify(practice));
  };

  return (
    <PracticeContext.Provider value={{ practiceInfo, updatePractice }}>
      {children}
    </PracticeContext.Provider>
  );
};

// Custom hook to use practice context
export const usePractice = () => {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
};