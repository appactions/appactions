import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { createDriver, tunnel } from 'cypress-app-actions/driver';
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

        tunnel(tableDriver).emit('sort', label, direction);
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

const tableDriver = createDriver(Table, {
    pattern: 'Table',
    getName: ({ $el }) => {
        const columns = [];
        $el.vDomFind('TableHeadCell').forEach($el => {
            columns.push($el.text().trim());
        });
        return columns.join(', ');
    },
    isLoading: ({ $el }) => {
        return $el.hasClass('spinner');
    },
    actions: {
        sort({ instance }, label, order) {
            instance.reorder(label, order)(new Event('click'));
        },

        getColumnLabels: ({ $el }) => {
            const columnsTitles = [];

            $el.vDomFind('TableHeadRow TableHeadCell').forEach($tableHeadCell => {
                columnsTitles.push($tableHeadCell.text().trim());
            });

            return columnsTitles;
        },

        getColumn: ({ $el, actions }, label) => {
            const columnsTitles = actions.getColumnLabels();
            const index = columnsTitles.indexOf(label);
            const results = [];
            let i;
            $el.vDomFind('TableHeadRow, TableRow').forEach($tableRow => {
                i = 0;
                $tableRow.vDomFind('TableHeadCell, TableCell').forEach($cell => {
                    if (i === index) {
                        results.push($cell.text().trim());
                    }
                    i += 1;
                });
            });
            return results;
        },

        getColumnOrThrow: ({ actions, retryable }, label) => {
            return retryable(() => {
                const columns = actions.getColumn(label);
                if (columns.length < 5) {
                    throw new Error();
                }
                return columns;
            })();
        },

        sortWithDependencyChecks: ({ $el, retryable, nonRetryable, actions }, columnLabel, order) => {
            const checkDependency = retryable($el => {
                if ($el.find(`th:contains(${columnLabel})`).length === 0) {
                    throw new Error('Element is not ready for interaction');
                }
                return $el;
            });

            const doSort = nonRetryable($el => {
                $el.vDomCallDriver('sort', columnLabel, order);
            });

            checkDependency($el);
            actions.sort(columnLabel, order);
        },

        advancedPurityComposition: ({ $el, retryable, nonRetryable }) => {
            const first = nonRetryable($el => {
                setTimeout(() => {
                    $el.append(Cypress.$('<h1 class="side-effect">1. side-effect</h1>'));
                }, 500);
            });

            const second = retryable(() => {
                if (Cypress.$('h1.side-effect').length !== 1) {
                    throw new Error();
                }
            });

            const third = nonRetryable($el => {
                setTimeout(() => {
                    $el.append(Cypress.$('<h2 class="side-effect">2. side-effect</h2>'));
                }, 500);
            });

            const fourth = retryable(() => {
                if (Cypress.$('h1.side-effect').length !== 1) {
                    throw new Error();
                }
                if (Cypress.$('h2.side-effect').length !== 1) {
                    throw new Error();
                }
            });

            first($el);
            second($el);
            third($el);
            fourth($el);
        },

        getDataByColumn: ({ actions }) => {
            const results = {};
            const columnsTitles = actions.getColumnLabels();
            columnsTitles.forEach(title => {
                results[title] = actions.getColumn(title).slice(1);
            });
            return results;
        },
    },
});

createDriver(TableRow, {
    pattern: 'TableRowTestable',
});


createDriver(TableHeadRow, {
    pattern: 'HeadRow',
    actions: {
        getColumnLabels: ({ $el }) => {
            const columnsTitles = [];

            $el.vDomFind('TableHeadCell').forEach($tableHeadCell => {
                columnsTitles.push($tableHeadCell.text().trim());
            });

            return columnsTitles;
        }
    }
});

createDriver('h2', {
    pattern: 'Header',
    getName: ({ $el }) => $el.text().trim(),
});
