import React from 'react';
import './App.css';
import Webcam from "react-webcam";
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'

// Definiciones globales
const serverUrl = "http://localhost:5000"
const minCategories = 2
const maxCategories = 4
const useTimer = false

// SampleCounter ===================================
function SampleCounter(props){
    let samplesList = props.n_samples .map((n,i) => <li key={i}>Ejemplos de la clase {i}: {n}</li>)

    return(
        <ul>{samplesList}</ul>
    );
}

// Network
function Network(props) {

    const width = 600
    const height = 450
    const layer_sep = 200
    const unit_sep = 80
    var nunits
    switch (props.size) {
        case 0:
            nunits = [2, 3, props.noutputs]
            break
        case 1:
            nunits = [3, 4, props.noutputs]
            break
        case 2:
            nunits = [4, 5, props.noutputs]
            break
    }

    const xpos = [-1, 0, 1].map((x, k) => x * layer_sep + width / 2)
    var layers = Array(3)
    var ypos = Array(3)
    for (var i = 0; i < layers.length; i++) {

        ypos[i] = Array.from(Array(nunits[i]).keys()).map((x, k) => height/2 + unit_sep * (k - nunits[i] / 2))

        layers[i] = ypos[i].map((x, k) => <circle key={k} onTransitionEnd={props.onTransitionEnd} className={(i === layers.length-1 &&  props.active === k )? "outputOn" : "output"}
                                                        cx={xpos[i]} cy={x} /> )
    }
    // lines
    var lines = Array((nunits[0]+nunits[2]) * nunits[1])
    var ind = 0
    var style = 0
    for (var i = 0; i < layers.length-1; i++)
        for (var j = 0; j < nunits[i]; j++)
            for (var z = 0; z < nunits[i+1]; z++) {
                style = "line"
                if (props.active !== -1) {
                    if (i + 1 === layers.length - 1) {
                        if (z === props.active)
                            style = "lineOn2"
                    } else
                        style = "lineOn1"
                }
                lines[ind] = <line key={ind} x1={xpos[i]} y1={ypos[i][j]} x2={xpos[i+1]} y2={ypos[i+1][z]}
                                   className={style} strokeWidth={"1"} />
                ind++
            }


    return (
        <svg width={width} height={height} className={"shadow"}>
            {lines}
            {layers}
            <embed src={props.imgSrc} x={100} y={100} width={100} height={100}/>
        </svg>
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
        console.log(e.key)
        // entrenamiento
        if (this.state.categoryNames.includes(Number(e.key))) {
            const imgSrc = this.webcam.getScreenshot()
            const category = Number(e.key)-1
            const entry = {category, imgSrc}
            this.setState({classify: false, category, outputOn: Number(e.key)-1, imgSrc})
            this.serverCall("/entrenar/",entry)

        }

        // test
        if (e.key.toLowerCase() === "c") {
            this.classifyPic()

        }

        // Cambiar la cantidad de salidas
        if (["+","-","a","z"].includes(e.key.toLowerCase())) {
            let categoryNames = this.state.categoryNames.slice()
            if (e.key.toLowerCase() === "a")
                categoryNames.push(Number(categoryNames[categoryNames.length - 1]) + 1)
            if (e.key.toLowerCase() === "z")
                categoryNames.pop()
            if ( minCategories <=  categoryNames.length && categoryNames.length <= maxCategories)
                this.setState({categoryNames})
            if(e.key === "+")
                if (this.state.netSize < 2)
                    this.setState({netSize: this.state.netSize + 1})

            if(e.key === "-")
                if (this.state.netSize > 0)
                    this.setState({netSize: this.state.netSize-1})
            const entry = {netSize: this.state.netsize, n_categories: this.state.categoryNames.length}
            this.serverCall("/modificarRed/",entry)

        }

    }

    handleTransitionEnd(){
        this.setState({outputOn: -1})
    }



    render(){

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
                    <Grid item lg={8}>
                        <Container>
                            <Network active = {this.state.outputOn} onTransitionEnd = {this.handleTransitionEnd}
                                     imgSrc={this.state.imgSrc} size={this.state.netSize} noutputs={this.state.categoryNames.length}/>
                        </Container>
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
