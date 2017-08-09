import 'materialize-css/dist/css/materialize.min.css';

import React from 'react';
import logo from './logo.png'
import './App.css'
import NewsPanel from '../NewsPanel/NewsPanel';

class App extends React.Component {
  render() {

    // use className since class is key word in JS
    // in html, put the javascript in {}
    return (
      <div>
        <img className='logo' src={logo} alt='logo'/>
        <div className='container'>
          <NewsPanel />
        </div>
      </div>
    )
  }
}

// must export
export default App;
