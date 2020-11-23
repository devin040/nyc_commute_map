import logo from './logo.svg';
import './App.css';
import mapboxgl from 'mapbox-gl'
import React from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios';
// import 'leaflet-search';

// MATERIAL UI IMPORTS 
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },


}));



// const google = window.google = window.google ? window.google : {}
// https://github.com/Giners/mui-places-autocomplete 

const brooklyn = require('./geo/bk_geo.json');
const API_KEY = process.env.REACT_APP_HERE_API_KEY;
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
// const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_KEY; // 
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
    // url: `https://transit.router.hereapi.com/v8/routes?apiKey=${API_KEY}&origin=${box.properties.centroids_y},${box.properties.centroids_x}&destination=${lat},${long}&units=imperial&return=travelSummary`,
    url: `https://transit.router.hereapi.com/v8/routes?apiKey=${API_KEY}&origin=${box.properties.centroids_y},${box.properties.centroids_x}&destination=${this.state.d_lat},${this.state.d_lng}&units=imperial&return=travelSummary`,
    // url: `https://transit.router.hereapi.com/v8/routes?apiKey=${API_KEY}&origin=${box.properties.centroids_y},${box.properties.centroids_x}&destination=40.754363,-73.985082&units=imperial&return=travelSummary`,
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
      commute: 0,
      d_lat: '',
      d_lng: '',
      mapob: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }

  async componentDidMount() {
    // const map = new mapboxgl.Map({
    //   container: this.mapContainer,
    //   style: 'mapbox://styles/mapbox/streets-v11',
    //   center: [this.state.lng, this.state.lat],
    //   zoom: this.state.zoom
    //   });
    // componentDidMount() {
    // this.autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('autocomplete'), {})
    // this.autocomplete.addListener("place_changed", this.handlePlaceSelect)


  // async displayMap(lat, long){
    
  // async displayMap(){

    // todo: map view 
    let map = L.map("leafletmap").setView([40.75, -73.9], 10 );
    
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: MAPBOX_TOKEN
    }).addTo(map);

    this.setState({
      mapob: map
    })

  }

  async displayCommute(map){
    // var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();

    // L.esri.Geocoding.geosearch({
    //   providers: [
    //     arcgisOnline,
    //     L.esri.Geocoding.mapServiceProvider({
    //       label: 'States and Counties',
    //       url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer',
    //       layers: [2, 3],
    //       searchFields: ['NAME', 'STATE_NAME']
    //     })
    //   ]
    // }).addTo(map);


    // map = this.state.mapob
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

    handleSubmit(event) {
      const lat = this.state.d_lat
      const long = this.state.d_lng
      // this.displayMap()
      // this.displayCommute(lat, long)
      // this.displayCommute(lat, long, this.state.map)
      this.displayCommute(this.state.map)
    }
  
    // handlePlaceSelect() {
    //   let addressObject = this.autocomplete.getPlace()
    //   let address = addressObject.address_components
    //   let coor = addressObject.geometry.location
    //   // console.log("lat: "+coor.lat()+"\n long: "+coor.long())
    //   //lat = coor.lat()
    //   //long = coor.long()
    //   // this.setState({
    //   // })
    // }


  
  

  render(){
    return (
     <React.Fragment>
       <div className="App">
    <Container component="main" maxWidth="xs" id='container'> 
      <CssBaseline />
      <div className={useStyles.paper} id='paper'>
        <Typography component="h1" variant="h5">
          NYC Commute Heatmap
        </Typography>
        <form className={useStyles.form} id='form' onSubmit={this.handleSubmit} noValidate>
        <TextField
          id="coor"
          label="Latitude"
          value={this.state.d_lat} 

          onChange={(e) => this.setState({ d_lat: e.target.value})}
        />
        <TextField
          id="coor"
          label="Longitude"
          value={this.state.d_lng} 

          onChange={(e) => this.setState({d_lng: e.target.value})}
        />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={useStyles.submit}
            id='submit'
            onClick={()=> {this.handleSubmit()}}
          >
            Display Commute Map
          </Button>
        </form>
      </div>
    </Container> 
    
        <div id="leafletmap"></div>     
      </div>
    </React.Fragment>

    );
  }
}

export default App;
