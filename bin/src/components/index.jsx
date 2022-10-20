import React from 'react';
import ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOMClient.hydrateRoot(
  document.getElementById('root'),
  <BrowserRouter>
    <App {...window.initState} />
  </BrowserRouter>,
);

delete window.initState;
