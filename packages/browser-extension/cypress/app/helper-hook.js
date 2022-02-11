import { useState } from 'react';

export function useAction(name, callback) {
    useState(() => ({ name, callback, actionHook: true }));
}
