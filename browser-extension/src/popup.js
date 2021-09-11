import 'libs/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';

const Popup = () => {
  return (
    'popup'
  );
};

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<Popup />, root);
