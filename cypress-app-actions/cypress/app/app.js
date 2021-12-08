import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { register } from 'cypress-app-actions/driver'
import './style.css';

class PageIndex extends Component {
    render() {
        return <div data-test="page-index" />;
    }
}

class PageInstant extends Component {
    render() {
        return (
            <>
                <h4>Hello Table!</h4>
                <Table
                    header={['Name', 'Color', 'Fruit']}
                    data={[
                        ['Apple', 'red', true],
                        ['Banana', 'yellow', true],
                        ['Carrot', 'orange', false],
                        ['Tomato', 'red', true],
                    ]}
                />
            </>
        );
    }
}

class PageMultiple extends Component {
    render() {
        return (
            <>
                <Table
                    header={['Name', 'Color', 'Fruit']}
                    data={[
                        ['Apple', 'red', true],
                        ['Banana', 'yellow', true],
                        ['Carrot', 'orange', false],
                        ['Tomato', 'red', true],
                    ]}
                />
                <Table
                    header={['Foo', 'Bar', 'Baz']}
                    data={[
                        ['1', 'aaa', true],
                        ['2', 'bbb', true],
                        ['3', 'ccc', false],
                        ['4', 'ddd', true],
                    ]}
                />
                <div data-test="last-table">
                    <Table
                        header={['Red', 'Green', 'Blue']}
                        data={[
                            ['23', '34', '40'],
                            ['167', '134', '160'],
                            ['200', '230', '120'],
                            ['0', '255', '0'],
                        ]}
                    />
                </div>
            </>
        );
    }
}

class PageSlow extends Component {
    state = {
        isLoaded: false,
    };
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                isLoaded: true,
            });
        }, 1000);
    }
    render() {
        return this.state.isLoaded ? (
            <Table
                header={['Name', 'Color', 'Fruit']}
                data={[
                    ['Apple', 'red', true],
                    ['Banana', 'yellow', true],
                    ['Carrot', 'orange', false],
                    ['Tomato', 'red', true],
                ]}
            />
        ) : null;
    }
}

class PageSlowSpinner extends Component {
    state = {
        isLoaded: false,
    };
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                isAppeared: true,
            });
        }, this.props.appearDelay || 1000);

        setTimeout(() => {
            this.setState({
                isLoaded: true,
            });
        }, this.props.appearDelay + this.props.loadDelay || 1000);
    }
    render() {
        const { isAppeared, isLoaded } = this.state;
        if (!isAppeared) {
            return 'Waiting for appear...';
        }
        return isLoaded ? (
            <Table
                header={['Name', 'Color', 'Fruit']}
                data={[
                    ['Apple', 'red', true],
                    ['Banana', 'yellow', true],
                    ['Carrot', 'orange', false],
                    ['Tomato', 'red', true],
                ]}
            />
        ) : (
            <Table
                className="spinner"
                header={['...', '...']}
                data={[
                    ['...', '...'],
                    ['...', '...'],
                ]}
            />
        );
    }
}

class PagePartial extends Component {
    state = {
        header: ['Name', 'Fruit'],
        data: [['...', '...']],
    };
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                header: ['Name', 'Color', 'Fruit'],
                data: [
                    ['Apple', 'red', true],
                    ['Banana', 'yellow', true],
                    ['Carrot', 'orange', false],
                    ['Tomato', 'red', true],
                ],
            });
        }, 1000);
    }
    render() {
        const { data, header } = this.state;
        return <Table header={header} data={data} />;
    }
}

const TableRow = ({ children }) => <tr className="table-row">{children}</tr>;
const TableHeadRow = ({ children }) => <tr>{children}</tr>;

const TableHeadCell = ({ label, orderOn, direction, onClick }) => {
    const hasArrow = orderOn === label;
    const arrow = direction === 'asc' ? '↑' : '↓';
    return (
        <th>
            <span onClick={onClick}>
                {label} {hasArrow ? arrow : ''}
            </span>
        </th>
    );
};

const TableCell = ({ cell }) => {
    if (typeof cell === 'boolean') {
        return <td>{cell ? 'Yes' : 'No'}</td>;
    }

    return <td>{cell}</td>;
};

class Table extends Component {
    state = {
        orderOn: null,
        direction: 'asc',
    };
    reorder = (label, direction) => event => {
        event.preventDefault();
        if (!this.props.header.includes(label)) {
            throw new Error(`Column does not exist with label "${label}"`);
        }
        this.setState({
            orderOn: label,
            direction,
        });
    };
    render() {
        const { header, data: rawData, className } = this.props;
        const { orderOn, direction } = this.state;
        const data =
            orderOn === null
                ? rawData
                : rawData.sort((a, b) => {
                      const index = header.indexOf(orderOn);
                      const relation = a[index] > b[index] ? -1 : 1;
                      return direction === 'asc' ? relation : -relation;
                  });

        const otherDirection = direction === 'asc' ? 'desc' : 'asc';
        return (
            <table className={`table ${className || ''}`}>
                <thead>
                    <TableHeadRow>
                        {header.map((label, index) => (
                            <TableHeadCell
                                key={index}
                                label={label}
                                orderOn={orderOn}
                                direction={direction}
                                onClick={this.reorder(label, otherDirection)}
                            />
                        ))}
                    </TableHeadRow>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            {row.map((cell, index) => (
                                <TableCell key={index} cell={cell} />
                            ))}
                        </TableRow>
                    ))}
                </tbody>
            </table>
        );
    }
}

const PageWithHeaders = () => (
    <>
        <h2>Pineapple</h2>
        <h2>Orange</h2>
        <h2>Apple</h2>
        <h2>Banana</h2>
        <h2>Grape</h2>
    </>
);

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/instant">Instant</Link>
                    </li>
                    <li>
                        <Link to="/multiple">Multiple</Link>
                    </li>
                    <li>
                        <Link to="/slow">Slow</Link>
                    </li>
                    <li>
                        <Link to="/slow-spinner">Slow (spinner)</Link>
                    </li>
                    <li>
                        <Link to="/partial">Partial</Link>
                    </li>
                    <li>
                        <Link to="/headers">Headers</Link>
                    </li>
                </ul>

                <hr />
                <div className="app">
                    <Route path="/" exact component={PageIndex} />
                    <Route path="/instant" exact component={PageInstant} />
                    <Route path="/multiple" exact component={PageMultiple} />
                    <Route path="/slow" exact component={PageSlow} />
                    <Route path="/slow-spinner" exact component={PageSlowSpinner} />
                    <Route
                        path="/very-slow-spinner"
                        exact
                        component={() => <PageSlowSpinner appearDelay={3000} loadDelay={2000} />}
                    />
                    <Route
                        path="/super-slow-spinner"
                        exact
                        component={() => <PageSlowSpinner appearDelay={3000} loadDelay={5000} />}
                    />
                    <Route path="/partial" exact component={PagePartial} />
                    <Route path="/headers" exact component={PageWithHeaders} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;

register(Table, {
    role: 'Table',
    drivers: {
        sort: (label, order) => (_, self) => {
            self.reorder(label, order)(new Event('click'));
        },
    },
});

register(TableRow, {
    role: 'TableRowTestable',
});

// register('h2', {
//     role: 'Header',
// });