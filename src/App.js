import React, { Component } from 'react';
import { myApiKey } from './config';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App(myApiKey);

const particlesOptions = {
  particles: {
    number: {
      value: 125,
      density: {
        enable: true,
        value_area: 750
      },
      move: {
        speed: 1
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin'
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      botRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value});
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
     this.state.input)
     .then((response) => this.displayFaceBox(this.calculateFaceLocation(response)))
     .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    this.setState( { route: route });
  }

  render() {
    return (
      <div className="App">
          <Particles className='particles'
            params={particlesOptions}
          />
        <Navigation onRouteChange={this.onRouteChange} />
        { this.state.route === 'signin' ?
          <SignIn onRouteChange={this.onRouteChange} />
          : <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={this.state.box} imageUrl={this.state.input} />
          </div>
        }
        
      </div>
    );
  }
}

export default App;
