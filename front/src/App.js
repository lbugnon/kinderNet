import React from 'react';
import './App.css';
import Webcam from "react-webcam";

// Definiciones globales
const serverUrl = "http://localhost:5000/"
const minCategories = 2
const maxCategories = 4

// SampleCounter ===================================
function SampleCounter(props){
    var samplesList = props.nsamples.map((n,i) => <li key={i}>Ejemplos de la clase {i}: {n}</li>)

    return(
        <ul>{samplesList}</ul>
    );
}


// Output ==========================================
function Output(props){

    const style = props.active ? "outputOn" : "output";
    return (
        <button onTransitionEnd={props.onTransitionEnd} className={style}> Clase {props.value} </button>
);
}

// event listener
class EventListener extends React.Component{
    componentDidMount() {
        window.addEventListener("keyup",this.props.onKeyUp)
    }
    componentWillUnmount() {
        window.removeEventListener("keyup",this.props.onKeyUp)
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
            category: -1,
            classify: false,
            netSize: 0, // mayor valor, mas compleja la red
            categoryNames: [1,2],
            loss: 0,
            nsamples: [0,0], // nsamples de la clase actual durante el entrenamiento
            outputOn: -1
        };
        this.captureGlobalEvent = this.captureGlobalEvent.bind(this);
        this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
        this.handleTimerOut = this.handleTimerOut.bind(this);
        this.serverCall = this.serverCall.bind(this);
        this.classifyPic = this.classifyPic.bind(this);
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

        // Inicializa el timer
        setTimeout(this.handleTimerOut,3000)

    }

    handleTimerOut(){

        let time = 4000

        if(this.state.classify){
            this.classifyPic()
            time = 500
        }
        else
            this.setState({classify: true}) // comienza modo clasificación


        console.log("timer set in ",time)
        setTimeout(this.handleTimerOut,time)
    }

    serverCall(url,entry){
        fetch(serverUrl + url, {
            method: "POST",
            body: JSON.stringify(entry),
            headers: new Headers({"content-type": "application/json"})
        }).then(response => response.json()).then(json => this.setState(json))
    }

    classifyPic(){
        const imgSrc = this.webcam.getScreenshot()
        const entry = {imgSrc}
        this.serverCall("clasificar/", entry)
        this.setState({classify: true, outputOn: this.state.category})
    }

    captureGlobalEvent(e) {
        // entrenamiento
        if (this.state.categoryNames.includes(Number(e.key))) {
            const imgSrc = this.webcam.getScreenshot()
            const category = Number(e.key)-1
            const entry = {category, imgSrc}
            this.setState({classify: false, category, outputOn: Number(e.key)-1})
            this.serverCall("entrenar/",entry)

        }

        // test
        if (e.key.toLowerCase() === "c") {
            this.classifyPic()
        }

        // Cambiar la cantidad de salidas
        if (["a","z"].includes(e.key.toLowerCase())) {
            let categoryNames = this.state.categoryNames.slice()
            if (e.key.toLowerCase() === "a")
                categoryNames.push(Number(categoryNames[categoryNames.length - 1]) + 1)
            if (e.key.toLowerCase() === "z")
                categoryNames.pop()
            if ( minCategories <=  categoryNames.length && categoryNames.length <= maxCategories)
                this.setState({categoryNames})
            const entry = {netSize: this.state.netSize, ncategories: this.state.categoryNames.length}
            this.serverCall("modificarRed/",entry)
             // TODO:  actualizar el dibujo

        }

        // Cambiar el tamaño de la red
        if (e.key === "+"){
        }

    }

    handleTransitionEnd(){
        this.setState({outputOn: -1})
    }



    render(){
        const Outputs = this.state.categoryNames.map((n, i) => <Output key = {i} value = {n}
                                                                       active = {i === this.state.outputOn}
                                                                       onTransitionEnd = {this.handleTransitionEnd}/>)

        return(
            <div>
                <EventListener onKeyUp={this.captureGlobalEvent}/>
                <Webcam
                    audio={false}
                    height={300}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={400}
                    className="Webcam"
                    //    videoConstraints={videoConstraints}
                />
                <h3> Predict: {this.state.classify.toString()} </h3>
                <p> Loss: {this.state.loss}</p>
                {Outputs}
                <SampleCounter category={this.state.category} nsamples={this.state.nsamples}/>


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
