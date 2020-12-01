import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ExploreIcon from '@material-ui/icons/Explore';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MapContainer from './Map';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="">
        CS 519 UIUC 
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));




export default function Main(){
  const classes = useStyles();
  const [showGetAPI, setShowGetAPI] = useState("false");  
  const [latlong, setLatlong] = useState();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowGetAPI("true");
  };
  
  const handleChange = (e) => {
    setLatlong(e.target.value);
  };
  
  return (
      <React.Fragment>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ExploreIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Explore NYC Commute Heatmap
        </Typography>
        <form className={useStyles.form} id='form' noValidate>
        <TextField
          id="coor"
          label="Latitude,Longitude"
          value={latlong}
          onChange={handleChange}


        />
        {/* <TextField
          id="coor"
          label="Longitude"
          value={post.long}
          onChange={handleChange} 


        /> */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={useStyles.submit}
            id='submit'
            onClick={handleSubmit}
            // onClick={()=> {this.handleSubmit()}}
          >
            Display Commute Map
          </Button>
        </form>
      </div>
      {/* <Box mt={8}>
        <Copyright />
      </Box> */}

    </Container>
        <div>
        {showGetAPI == "true" && (
            <div>
            <MapContainer
                latlong={latlong}
            />
            </div>
        )}
    </div>
    </React.Fragment>

  );
}