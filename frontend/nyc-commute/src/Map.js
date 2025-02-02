import mapboxgl from 'mapbox-gl'
import React from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios';
import { saveSync } from 'save-file'


const nyc = require('./geo/bryantpark_result.json');

const API_KEY = process.env.REACT_APP_HERE_API_KEY;
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
let colormap = require('colormap');



let colors = colormap({colormap: 'magma', nshades: 240, format:'hex', alpha: 1})

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
    color: determineColor(feature.properties.commuteTime),
    weight: 0, 
    opacity: 0,
    fillOpacity: .8
  }
}


  async function getCommute(box, latlong){
  // function getCommute(box, latlong){


  return axios({
    method: 'get',
    url: `https://transit.router.hereapi.com/v8/routes?apiKey=${API_KEY}&origin=${box.properties.centroids_y},${box.properties.centroids_x}&destination=${latlong}&units=imperial&return=travelSummary`,
    // url: `https://transit.router.hereapi.com/v8/routes?apiKey=${API_KEY}&origin=${box.properties.centroids_y},${box.properties.centroids_x}&destination=${lat},${long}&units=imperial&return=travelSummary`,
    // url: `https://transit.router.hereapi.com/v8/routes?apiKey=${API_KEY}&origin=${box.properties.centroids_y},${box.properties.centroids_x}&destination=40.754363,-73.985082&units=imperial&return=travelSummary`,
    data: {}
  }).then(res => res)
}


class MapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          lng: -73.9,
          lat: 40.75,
          zoom: 10,
          commute: 0,
          d_lat: '',
          d_lng: '',
          latlong: '',
        };
        
      }
      map_object = '';
      latlong = '';
    
      // componentDidMount() {
      async componentDidMount(){

        const latlong = this.props.latlong
        console.log(latlong)
        const map = L.map("leafletmap").setView([40.75, -73.9], 10 );
        
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: MAPBOX_TOKEN
        }).addTo(map);
       

        console.log(colors)
    
        for (var i = 0; i < nyc['features'].length; i++){
          var box = nyc['features'][i]
          // const response = await getCommute(box,latlong);
    
          // console.log(response);
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
          //   nyc['features'][i] = box;
          var geoJsonLayer = L.geoJson(box, {style: style}).addTo(map);
        }


        // saveSync(JSON.stringify(nyc), 'mapresult.json')
      }
    
      
      
    
      render(){
        return (
          <div>
            {/* <h4>{this.props.latlong}</h4> */}
            <div id="leafletmap"></div> 
          </div>

    
        );
      }
    }
    
    export default MapContainer;