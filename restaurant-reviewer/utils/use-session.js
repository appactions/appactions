import React, { useContext } from 'react';

export const SessionContext = React.createContext(null);

export default function useSession() {
    return useContext(SessionContext);
}
