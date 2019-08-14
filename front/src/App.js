import React from 'react';
import './App.css';
import Webcam from "react-webcam";

class WebcamCapture extends React.Component {

  constructor(props){
    super(props);
    this.state={
      imgSrc: ""
    }
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    this.setState({imgSrc : this.webcam.getScreenshot()});
  };

  render() {
    //const videoConstraints = {
    //  width: 1280,
    //  height: 720,
    //  facingMode: "user"
    //};

    return (
      <div>
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
      //    videoConstraints={videoConstraints}
        />
        <button onClick={this.capture}>Capture photo</button>
        <img src={this.state.imgSrc} alt='imagen'/>
      </div>
    );
  }
}

function App() {
  return (
      <WebcamCapture />
  );
}

export default App;
