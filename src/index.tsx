import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './fonts/karnak/karnak-normal-400.ttf';
import './fonts/franklin/franklin-normal-300.ttf';
import './fonts/franklin/franklin-normal-500.ttf';
import './fonts/franklin/franklin-normal-600.ttf';
import './fonts/franklin/franklin-normal-700.ttf';
import './fonts/franklin/franklin-normal-800.ttf';
import './fonts/franklin/franklin-normal-900.ttf';
import './fonts/franklin/franklin-small-normal-500.ttf';
import './fonts/franklin/franklin-small-normal-700.ttf';
import './fonts/franklin/franklin-italic-300.ttf';
import './fonts/franklin/franklin-italic-500.ttf';
import './fonts/franklin/franklin-italic-600.ttf';
import './fonts/franklin/franklin-italic-700.ttf';
import './fonts/franklin/franklin-italic-800.ttf';
import './fonts/franklin/franklin-italic-900.ttf';

import "./index.css";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
