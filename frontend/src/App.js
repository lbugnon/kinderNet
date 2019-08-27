import React from 'react';
import './App.css';
import Webcam from "react-webcam";
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'

// Definiciones globales
const serverUrl = "http://localhost:5000"
const minCategories = 2
const maxCategories = 4
const useTimer = true

// SampleCounter ===================================
function SampleCounter(props){
    let samplesList = props.n_samples .map((n,i) => <li key={i}>Ejemplos de la clase {i}: {n}</li>)

    return(
        <ul>{samplesList}</ul>
    );
}


// Output ==========================================
function Output(props){

    const style = props.active ? "outputOn" : "output";
    //const style = props.active ? "contained" : "outlined";
    return (
        <button onTransitionEnd={props.onTransitionEnd} className={style}> Clase {props.value} </button>
        //<Button onTransitionEnd={props.onTransitionEnd} variant={style}> Clase {props.value} </Button>
);
}

// Network ==========================================
function Network(props){

    let layer1, layer2, layer3
    //if (props.netSize === 0){
        layer1 = [1,2]
        layer2 = [1,2,3]
        layer3 = [...Array(props.outputs).keys()]
    //}
    layer1 = layer1.map((x, i) => <Grid container direction="column"><span key={i} className = "neuron"></span></Grid>)
    layer2 = layer2.map((x, i) => <Grid container direction="column"><span key={i} className = "neuron"></span></Grid>)
    layer3 = layer3.map((x, i) => <Grid container direction="column"><span key={i} className = "neuron"></span></Grid>)


    return (
        <Grid container>
            <Grid item>
                {layer1}
            </Grid>
            <Grid item>
                {layer2}
            </Grid>
            <Grid item>
                {layer3}
            </Grid>
        </Grid>

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
            n_samples : [0,0], // n_samples  de la clase actual durante el entrenamiento
            outputOn: -1,
            timer: 4000
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
        if(useTimer)
            setTimeout(this.handleTimerOut,3000)

    }

    handleTimerOut(){


        let time = this.state.timer

        if(this.state.category === -1){
            setTimeout(this.handleTimerOut,time)
            return
        }


        if(this.state.classify){
            this.classifyPic()
            time = 500
        }
        else
            this.setState({classify: true}) // comienza modo clasificación

        setTimeout(this.handleTimerOut,time)
        return
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
        this.serverCall("/clasificar/", entry)
        this.setState({classify: true, outputOn: this.state.category})
    }

    captureGlobalEvent(e) {
        // entrenamiento
        if (this.state.categoryNames.includes(Number(e.key))) {
            const imgSrc = this.webcam.getScreenshot()
            const category = Number(e.key)-1
            const entry = {category, imgSrc}
            this.setState({classify: false, category, outputOn: Number(e.key)-1})
            this.serverCall("/entrenar/",entry)

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
            const entry = {netSize: this.state.netSize, n_categories: this.state.categoryNames.length}
            this.serverCall("/modificarRed/",entry)
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
        const Outputs = this.state.categoryNames.map((n, i) => <Container key = {i}> <Output  value = {n}
                                                                       active = {i === this.state.outputOn}
                                                                       onTransitionEnd = {this.handleTransitionEnd}/>
        </Container>)

        return(
            <div style={{padding: 50}}>
                <Grid container spacing={0} justify="center" align="center">
                    <EventListener onKeyUp={this.captureGlobalEvent}/>
                    <Grid item lg={4}>
                        <Container >
                            <Webcam
                                audio={false}
                                ref={this.setRef}
                                screenshotFormat="image/png"
                                quality={1}
                                className="Webcam"
                            />
                        <Container align="left">
                            <p> Loss: {this.state.loss}</p>
                            <SampleCounter category={this.state.category} n_samples ={this.state.n_samples}/>
                        </Container>
                        </Container>
                    </Grid>
                    <Grid item lg={4}>
                        <Container>
                            <Network size={this.state.netSize} outputs={this.state.categoryNames.length}/>
                        </Container>
                    </Grid>
                    <Grid item lg={4}>
                        <Grid container direction="column" justify="center" alignment="center">
                            {Outputs}
                        </Grid>

                    </Grid>
                </Grid>
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
