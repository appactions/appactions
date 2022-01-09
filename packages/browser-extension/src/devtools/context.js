import { createContext, useContext } from 'react';

export const DevtoolsContext = createContext(null);

export const useDevtoolsContext = () => useContext(DevtoolsContext);