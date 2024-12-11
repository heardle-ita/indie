import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CheckDate from './CheckDate';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

if (process.env.NODE_ENV !== 'development') {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
}

ReactDOM.render(
  <React.StrictMode>
    <CheckDate />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();