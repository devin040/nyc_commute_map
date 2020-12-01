import './App.css';
import React from 'react'
import Main from './Main'
// import 'leaflet-search';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latlong: ''
    };    
  }

  render(){
    return (
      <div className="App">
        <Main />
      </div>

    );
  }
}

export default App;
