import React from 'react';
import ReactDOM from 'react-dom/client';
import 'tw-elements';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { UserContextProvider } from './context/UserContext';

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <UserContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<App />}/>
      </Routes>
    </BrowserRouter>
  </UserContextProvider>
  // </React.StrictMode>
);