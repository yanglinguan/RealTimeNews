import React from 'react'
import ReactDOM from 'react-dom';
import App from './App/App';
import './index.css';

// import LoginPage from './Login/LoginPage';
import SignUpPage from './SignUp/SignUpPage';

// react app entry point
ReactDOM.render(
  <SignUpPage />,
  document.getElementById('root')
)
