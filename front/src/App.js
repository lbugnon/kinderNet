import React from 'react';
import './App.css';
import Webcam from "react-webcam";

// event listener
class EventListener extends React.Component{
  componentDidMount() {
    window.addEventListener("keydown",this.props.onKeyDown)
  }
  componentWillUnmount() {
    window.removeEventListener("keydown",this.props.onKeyDown)
  }
  render(){
    return null;
  }

}

// Kindernet ==========================================
class KinderNet extends React.Component{
    constructor(props){
        super(props);
        this.state={
            category: 0,
            predict: false,
            netSize: 0, // mayor valor, mas compleja la red
            categoryNames: [1,2],
            loss: 0,
            nsamples: 0 // nsamples de la clase actual durante el entrenamiento
        };
        this.captureGlobalEvent = this.captureGlobalEvent.bind(this);
    }
    setRef = webcam => {
        this.webcam = webcam;
    };

    captureGlobalEvent(e) {
        // entrenamiento
        if (this.state.categoryNames.includes(Number(e.key))) {
            const imgSrc = this.webcam.getScreenshot()
            this.setState({predict: false})
            this.setState({category: Number(e.key)-1})
            const url = "http://localhost:5000/entrenar"

            const entry = {
                category: this.state.category,
                imgSrc
            }

            fetch(url, {
                method: "POST",
                //credentials: "include",
                body: JSON.stringify(entry),
                cache: "no-cache",
                headers: new Headers({"content-type": "application/json"})
            }).then(response => response.json()).then(json => this.setState({loss: json.loss, nsamples: json.nsamples}))
        }

        // test
        if (e.key.toLowerCase() === "c") {
            console.log("en test")
            const imgSrc = this.webcam.getScreenshot()
            this.setState({predict: true})
            const url = "http://localhost:5000/clasificar"

            const entry = {
                imgSrc
            }

            fetch(url, {
                method: "POST",
                //credentials: "include",
                body: JSON.stringify(entry),
                cache: "no-cache",
                headers: new Headers({"content-type": "application/json"})
            }).then(response => response.json()).then(json => this.setState({category: json.category}))
        }

        // Cambiar la cantidad de salidas
        if (["a","z"].includes(e.key.toLowerCase())){
            var categoryNames = this.state.categoryNames
            if (e.key.toLowerCase() === "z"){
                categoryNames.pop()
                this.setState({categoryNames})
                console.log(this.state.categoryNames)
            }
            else{
                categoryNames.push(Number(categoryNames[categoryNames.length-1])+1)
                this.setState({categoryNames})
                console.log(this.state.categoryNames)
            }
            // todo: mandar el nuevo estado al servidor y actualizar el dibujo
            // Cambiar el tamaño de la red
            if (e.key === "+"){
            }
        }
    }
    render(){
    return(
        <div>
            <EventListener onKeyDown={this.captureGlobalEvent}/>
            <Webcam
                audio={false}
                height={300}
                ref={this.setRef}
                screenshotFormat="image/jpeg"
                width={400}
                className="Webcam"
                //    videoConstraints={videoConstraints}
            />
            <h3> Category names:  {this.state.categoryNames.toString()}, training {this.state.categoryNames[this.state.category].toString()}. predict: {this.state.predict.toString()} </h3>
            <p> {this.state.loss}</p>
            <p style={{color:"red"}}> {this.state.nsamples}</p>

        </div>


     );
  }

}


function App() {
  return (
      <KinderNet />
  );
}

export default App;
