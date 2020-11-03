import logo from './logo.svg';
import './App.css';
import mapboxgl from 'mapbox-gl'
import React from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios';

const brooklyn = require('./geo/bk_geo.json');
const API_KEY = process.env.REACT_APP_HERE_API_KEY;
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
let colormap = require('colormap');


let colors = colormap({colormap: 'hot', nshades: 240, format:'hex', alpha: 1})

function determineColor(commuteTime){
  if (commuteTime == -1){
    return '#000000'
  }
  if (commuteTime >= 7200 ){
    return colors[239]
  }
  return colors[Math.floor(commuteTime / 30)]
}

function style(feature){
  return {
    fillColor: determineColor(feature.properties.commuteTime),
    weight: .1, 
    opacity: 1,
    fillOpacity: .6
  }
}


async function getCommute(box){
  return axios({
    method: 'get',
    url: `https://transit.router.hereapi.com/v8/routes?apiKey=${API_KEY}&origin=${box.properties.centroids_y},${box.properties.centroids_x}&destination=40.754363,-73.985082&units=imperial&return=travelSummary`,
    data: {}
  }).then(res => res)
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -73.9,
      lat: 40.75,
      zoom: 10,
      commute: 0
    };
  }

  async componentDidMount() {
    // const map = new mapboxgl.Map({
    //   container: this.mapContainer,
    //   style: 'mapbox://styles/mapbox/streets-v11',
    //   center: [this.state.lng, this.state.lat],
    //   zoom: this.state.zoom
    //   });

    let map = L.map("leafletmap").setView([40.75, -73.9], 10 );
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: MAPBOX_TOKEN
    }).addTo(map);

    
    console.log(colors)

    for (var i = 0; i < brooklyn['features'].length-260; i++){
      var box = brooklyn['features'][i]
      // axios.get(`https://transit.router.hereapi.com/v8/routes?apiKey=O-mhOguVcFOGqx9f5yN6pbAjHjjIVyvi3zx_vsNS3LI&origin=${box.properties.centroids_y},${box.properties.centroids_x}&destination=40.754363,-73.985082&units=imperial&return=travelSummary`).then(response => {
      //   console.log(response);
      //   if (response.status === 200){
      //     try {
      //       let legs = response.data.routes[0].sections;
      //       let duration = 0;
      //       for (var leg = 0; leg < legs.length; leg++){
      //         duration += legs[leg].travelSummary.duration;
      //       }
      //       box.properties.commuteTime = duration;
      //     } catch(error){
      //       box['properties'].commuteTime = -1;
      //       console.log("Caught an error");
      //     }
            
      //   } else {
      //     box['properties'].commuteTime = -1
      //   }
      //   console.log(box)
      //   //box['properties'].commuteTime = i*30;
      //   var geoJsonLayer = L.geoJson(box, {style: style}).addTo(map);
      //   this.setState({commute: i })
      // });
      const response = await getCommute(box);
      console.log(response);
        if (response.status === 200){
          try {
            let legs = response.data.routes[0].sections;
            let duration = 0;
            for (var leg = 0; leg < legs.length; leg++){
              duration += legs[leg].travelSummary.duration;
            }
            box.properties.commuteTime = duration;
          } catch(error){
            box['properties'].commuteTime = -1;
            console.log("Caught an error");
          }
            
        } else {
          box['properties'].commuteTime = -1
        }
        console.log(box)
        var geoJsonLayer = L.geoJson(box, {style: style}).addTo(map);
      

    }

    }

  render(){
    return (
      
      <div className="App">
        <header className="App-header">
        <div id="leafletmap"></div>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <div>
            {/* <div ref={el => this.mapContainer = el} className="mapContainer" /> */}
          </div>
          
        </header>
      </div>
    );
  }
}

export default App;
