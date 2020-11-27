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
        <Main></Main>
      </div>

    //  <React.Fragment>
    //    <div className="App">
    // <Container component="main" maxWidth="xs" id='container'> 
    //   <CssBaseline />
    //   <div id='paper'>
    //     <Typography component="h1" variant="h5">
    //       NYC Commute Heatmap
    //     </Typography>
    //     <form id='form'noValidate>
    //     <TextField
    //       id="coor"
    //       label="Latitude, Longitude"
    //       value={this.state.d_lat} 

    //       onChange={(e) => this.setState({ d_lat: e.target.value})}
    //     />
    //     {/* <TextField
    //       id="coor"
    //       label="Longitude"
    //       value={this.state.d_lng} 

    //       onChange={(e) => this.setState({d_lng: e.target.value})}
    //     /> */}

    //       <Button
    //         type="submit"
    //         fullWidth
    //         variant="contained"
    //         color="primary"
    //         id='submit'
    //         onClick={()=> {this.handleSubmit()}}
    //       >
    //         Display Commute Map
    //       </Button>
    //     </form>
    //   </div>
    // </Container> 
    
    //     <div id="leafletmap"></div>     
    //   </div>
    // </React.Fragment>

    );
  }
}

export default App;
