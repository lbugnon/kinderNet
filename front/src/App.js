import React from 'react';
import './App.css';
import Webcam from "react-webcam";
const serverUrl = "http://localhost:5000/"


// SampleCounter ==========================================
function SampleCounter(props){
    var samplesList = props.nsamples.map((n,i) => <li className={props.category == i ? "sampleListShow" : "sampleList"} key={i}>Ejemplos de la clase {i}: {n}</li>)

    return(
        <ul>{samplesList}</ul>
    );
}

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
            nsamples: [0,0] // nsamples de la clase actual durante el entrenamiento
        };
        this.captureGlobalEvent = this.captureGlobalEvent.bind(this);
    }
    setRef = webcam => {
        this.webcam = webcam;
    };

    componentDidMount() {
        // Inicializa el modelo
        fetch(serverUrl, {
            method: "POST",
            //credentials: "include",
            cache: "no-cache",
            headers: new Headers({"content-type": "application/json"})
        }).then(response => response.json()).then(json => console.log("Init!"))


    }

    captureGlobalEvent(e) {
        // entrenamiento
        if (this.state.categoryNames.includes(Number(e.key))) {
            const imgSrc = this.webcam.getScreenshot()
            this.setState({predict: false})
            this.setState({category: Number(e.key)-1})
            const url = serverUrl+"entrenar/"

            const entry = {
                category: this.state.category,
                imgSrc
            }

            fetch(url, {
                method: "POST",
                //credentials: "include",
                body: JSON.stringify(entry),
                headers: new Headers({"content-type": "application/json"})
            }).then(response => response.json()).then(json => this.setState({loss: json.loss, nsamples: json.nsamples}))
        }

        // test
        if (e.key.toLowerCase() === "c") {
            console.log("en test")
            const imgSrc = this.webcam.getScreenshot()
            this.setState({predict: true})
            const url = serverUrl+"clasificar/"

            const entry = {
                imgSrc
            }

            fetch(url, {
                method: "POST",
                //credentials: "include",
                body: JSON.stringify(entry),
                headers: new Headers({"content-type": "application/json"})
            }).then(response => response.json()).then(json => this.setState({category: json.category}))
        }

        // Cambiar la cantidad de salidas
        if (["a","z"].includes(e.key.toLowerCase())) {
            var categoryNames = this.state.categoryNames
            if (e.key.toLowerCase() === "a") {
                if (this.state.categoryNames.length < 5) {
                    categoryNames.push(Number(categoryNames[categoryNames.length - 1]) + 1)
                    this.setState({categoryNames})
                } else
                    return // Cantidad máxima de salidas
            }
            if (e.key.toLowerCase() === "z"){
                if (this.state.categoryNames.length > 2) {
                    categoryNames.pop()
                    this.setState({categoryNames})
                } else
                    return // Cantidad minima de salidas
            }
            // todo:  actualizar el dibujo
            var entry = {netSize: this.state.netSize, ncategories: this.state.categoryNames.length}
            fetch(serverUrl + "modificarRed/", {
                method: "POST",
                body: JSON.stringify(entry),
                headers: new Headers({"content-type": "application/json"})
            }).then(response => response.json()).then(json => this.setState({network_img: json.network_img, nsamples: json.nsamples}))
        }

        // Cambiar el tamaño de la red
        if (e.key === "+"){
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
            <h3> predict: {this.state.predict.toString()} </h3>
            <p> Loss: {this.state.loss}</p>
            <SampleCounter category={this.state.category} nsamples={this.state.nsamples}/>_
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
