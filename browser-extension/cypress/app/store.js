import { useCallback } from 'react';
import { atomWithHash, selectAtom, useAtomValue, useUpdateAtom } from 'jotai/utils';

const stateAtom = atomWithHash('state', {
    filter: 'all',
    todos: [],
});

export const useSelector = selector => useAtomValue(selectAtom(stateAtom, selector));

export const useDispatch = () => {
    const setState = useUpdateAtom(stateAtom);
    return useCallback(
        action => {
            switch (action.type) {
                case 'SET_FILTER':
                    setState(prev => ({
                        ...prev,
                        filter: action.filter,
                    }));
                    break;
                case 'ADD_TODO':
                    setState(prev => ({
                        ...prev,
                        todos: [
                            ...prev.todos,
                            {
                                id: action.id,
                                title: action.title,
                                completed: false,
                            },
                        ],
                    }));
                    break;
                case 'REMOVE_TODO':
                    setState(prev => ({
                        ...prev,
                        todos: prev.todos.filter(todo => todo.id !== action.id),
                    }));
                    break;
                case 'TOGGLE_TODO':
                    setState(prev => ({
                        ...prev,
                        todos: prev.todos.map(todo =>
                            todo.id === action.id
                                ? {
                                      ...todo,
                                      completed: !todo.completed,
                                  }
                                : todo,
                        ),
                    }));
                    break;
                default:
                    throw new Error('unknown action');
            }
        },
        [setState],
    );
};
