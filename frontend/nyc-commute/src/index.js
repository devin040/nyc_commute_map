import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Main from './Main';
import reportWebVitals from './reportWebVitals';
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = "pk.eyJ1IjoidGhlbGFtaWEiLCJhIjoiY2toMWpwcnh6MHB6dDJxcnN3c3YycmJzdSJ9.lsvWA8vWs3sm6rSDdF-_3Q"

ReactDOM.render(
  <React.StrictMode>
    {/* <Main 
    handleChange={this.handleChange}
    post={this.sate.post}
    handleSubmit={this.handleSubmit}
    /> */}
    <App />

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
