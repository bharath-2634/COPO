import React, { createContext, useState, useContext } from 'react';

const BatchContext = createContext();

export const useBatch = () => {
  return useContext(BatchContext);
};

export const BatchProvider = ({ children }) => {
  const [batchId, setBatchId] = useState(null);

  return (
    <BatchContext.Provider value={{ batchId, setBatchId }}>
      {children}
    </BatchContext.Provider>
  );
};
