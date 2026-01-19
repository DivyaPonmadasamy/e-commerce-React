import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './stores/store';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
// import Cart from './components/Cart';
// import PrivateRoute from './components/PrivateRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <CookiesProvider>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          {/* <Route path="/cart" element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }/> */}
        </Routes>
      </BrowserRouter>
    </Provider>
  </CookiesProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
