import React from 'react';
import { useCallback } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { a, useTransition } from '@react-spring/web';
import { Radio } from 'antd';
import { useSelector, useDispatch } from './store';
import { createDriver, tunnel } from 'cypress-app-actions/driver';
import 'antd/dist/antd.css';
import './style.css';

const TodoItem = ({ id }) => {
    const dispatch = useDispatch();
    const item = useSelector(useCallback(state => state.todos.find(todo => todo.id === id), [id]));
    const toggleCompleted = () => dispatch({ type: 'TOGGLE_TODO', id });
    const remove = () => dispatch({ type: 'REMOVE_TODO', id });
    return (
        <>
            <input type="checkbox" checked={item?.completed} onChange={toggleCompleted} />
            <span style={{ textDecoration: item?.completed ? 'line-through' : '' }}>{item?.title}</span>
            <CloseOutlined onClick={remove} />
        </>
    );
};

const FilterSelection = () => {
    const dispatch = useDispatch();
    const filter = useSelector(useCallback(state => state.filter, []));
    return (
        <Radio.Group onChange={e => dispatch({ type: 'SET_FILTER', filter: e.target.value })} value={filter}>
            <Radio value="all">All</Radio>
            <Radio value="completed">Completed</Radio>
            <Radio value="incompleted">Incompleted</Radio>
        </Radio.Group>
    );
};

const Filtered = () => {
    const ids = useSelector(
        useCallback(
            state =>
                state.todos
                    .filter(
                        todo =>
                            state.filter === 'all' || state.filter === (todo.completed ? 'completed' : 'incompleted'),
                    )
                    .map(todo => todo.id),
            [],
        ),
    );
    const transitions = useTransition(ids, {
        keys: todo => todo.toString(),
        from: { opacity: 0, height: 0 },
        enter: { opacity: 1, height: 40 },
        leave: { opacity: 0, height: 0 },
    });
    return transitions((style, id) => (
        <a.div className="item" style={style}>
            <TodoItem id={id} />
        </a.div>
    ));
};

let count = 0;

const TodoList = () => {
    const dispatch = useDispatch();
    const add = e => {
        e.preventDefault();
        const id = `${++count}`;
        const title = e.currentTarget.inputTitle.value;
        e.currentTarget.inputTitle.value = '';
        dispatch({ type: 'ADD_TODO', id, title });
    };
    return (
        <form onSubmit={add}>
            <FilterSelection />
            <input name="inputTitle" placeholder="Type ..." />
            <Filtered />
        </form>
    );
};

export default function App() {
    return (
        <>
            <h1>Jōtai</h1>
            <TodoList />
        </>
    );
}

createDriver(App, {
    pattern: 'App',
});

createDriver(TodoItem, {
    pattern: 'Item',
    getName: ({ $el }) => $el.text().trim(),
});
