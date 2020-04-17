import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import SocketController from './components/SocketController';

import './App.css';

const App = () => (
  <BrowserRouter>
    <SocketController />
  </BrowserRouter>
)

export default App;
