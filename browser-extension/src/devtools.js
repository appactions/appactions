import React from 'react';
import ReactDOM from 'react-dom';

const root = document.createElement('div');
const shadow = root.attachShadow({ mode: 'open' });

const styleContainer = document.createElement('div');
const appContainer = document.createElement('div');

shadow.appendChild(styleContainer);
shadow.appendChild(appContainer);

document.body.appendChild(root);

const App = () => {
    return 'devtools page';
};

ReactDOM.render(<App />, appContainer);

chrome.devtools.panels.create('App Actions', 'assets/img/icon-128x128.png', 'devtools.html', function (panel) {
    console.log('waddup', panel);
    // code invoked on panel creation
});
