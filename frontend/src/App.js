import React from 'react';
import './App.css';
import Webcam from "react-webcam";
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'

// Definiciones globales
const server_url = "http://localhost:5000"
const min_categories = 2
const max_categories = 4
const use_timer = true
const base_timer = 4000

// SampleCounter ===================================
function SampleCounter(props){
    let samplesList = props.n_samples.map((n,i) => <li key={i}>Ejemplos de la clase {i}: {n}</li>)
    return(
        <ul>{samplesList}</ul>
    );
}

// Network
function Network(props){

    const width = 800
    const xcenter = width / 3
    const height = 550
    const layer_sep = 200
    const unit_sep = [90, 90, 110]
    var nunits

    const xpos = [-1, 0, 1].map((x, k) => x * layer_sep + xcenter)
    var layers = Array(3)
    var ypos = Array(3)

    const max_units = [4, 5, max_categories]
    switch (props.size) {
        case 0:
            nunits = [2, 3, props.n_outputs]
            break
        case 1:
            nunits = [3, 4, props.n_outputs]
            break
        case 2:
            nunits = [4, 5, props.n_outputs]
            break
        default:
            break
    }

    for (let i = 0; i < layers.length; i++) {
        layers[i] = Array(max_units[i])
        ypos[i] =  Array(max_units[i])
        for (let j = 0; j < max_units[i]; j++) {

            style = "output"
            ypos[i][j] = height / 2 + unit_sep[i] * (j - nunits[i] / 2)
            if (i === layers.length - 1 && props.active === j)
                style += " output-on"
            if (j >= nunits[i])
                style += " hidden"

            layers[i][j] = <circle key={j} onTransitionEnd={props.onTransitionEnd} className={style}
                                   cx={xpos[i]} cy={ypos[i][j]}/>
        }
    }
    // lines
    var lines = Array((max_units[0]+max_units[2]) * max_units[1])
    var ind = 0
    var style = 0
    for (var i = 0; i < layers.length-1; i++)
        for (var j = 0; j < max_units[i]; j++)
            for (var z = 0; z < max_units[i+1]; z++) {
                style = "line"
                if (props.active !== -1) {
                    if (i + 1 === layers.length - 1) {
                        if (z === props.active)
                            style += " line-on2"
                    } else
                        style += " line-on1"
                    }
                if (j >= nunits[i] || z >= nunits[i+1])
                        style += " hidden"


                lines[ind] = <line key={ind} x1={xpos[i]} y1={ypos[i][j]} x2={xpos[i+1]} y2={ypos[i+1][z]}
                                   className={style} strokeWidth={"1"} />
                ind++
            }

    const im_height = 100
    const category_display = props.images.map((v, k) => <image key={k} xlinkHref={props.images[k]}
                                                               x={xpos[2]+layer_sep/3} y={Math.floor(ypos[2][k])-im_height/2}
                                                               viewBox={"0 0 1 1"}
                                                               width={im_height} height={im_height} preserveAspectRatio="xMidYMid slice"/>)

    return (
            <svg width={width} height={height} className={"shadow"} xmlns={"http://www.w3.org/2000/svg"}>
            {lines}
            {layers}
            {category_display}
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
            net_size: 0, // mayor valor, mas compleja la red
            category_names: [1,2],
            images: [[],[]],
            loss: 0,
            n_samples : [0,0], // n_samples  de la clase actual durante el entrenamiento
            output_on: -1,
            timer: base_timer
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
        fetch(server_url, {
            method: "POST",
            //credentials: "include",
            cache: "no-cache",
            headers: new Headers({"content-type": "application/json"})
        }).then(response => response.json()).then(json => console.log("Init!"))

        // Inicializa el timer
        if(use_timer)
            setTimeout(this.handleTimerOut,base_timer)

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
        fetch(server_url + url, {
            method: "POST",
            body: JSON.stringify(entry),
            headers: new Headers({"content-type": "application/json"})
        }).then(response => response.json()).then(json => this.setState(json))
    }

    classifyPic(){
        const imgSrc = this.webcam.getScreenshot()
        const entry = {imgSrc}
        this.serverCall("/clasificar/", entry)
        this.setState({classify: true, output_on: this.state.category})
        }

    captureGlobalEvent(e) {

        // entrenamiento
        if (this.state.category_names.includes(Number(e.key))) {
            let images = this.state.images.slice()
            const category = Number(e.key)-1
            images[category] = this.webcam.getScreenshot()
            const entry = {category, imgSrc: images[category]}
            this.setState({classify: false, category, output_on: Number(e.key)-1, images})
            this.serverCall("/entrenar/",entry)

        }

        // test
        if (e.key.toLowerCase() === "c") {
            this.classifyPic()
            this.setState({timer: base_timer, category: -1})

        }

        // Cambiar la cantidad de salidas
        if (["+","-","a","z"].includes(e.key.toLowerCase())) {
            let category_names = this.state.category_names.slice()
            if (e.key.toLowerCase() === "a")
                category_names.push(Number(category_names[category_names.length - 1]) + 1)
            if (e.key.toLowerCase() === "z")
                category_names.pop()
            if ( min_categories <=  category_names.length && category_names.length <= max_categories)
                this.setState({category_names, images: Array(category_names.length), category: -1})
            if(e.key === "+")
                if (this.state.net_size < 2)
                    this.setState({net_size: this.state.net_size + 1, category: -1})

            if(e.key === "-")
                if (this.state.net_size > 0)
                    this.setState({net_size: this.state.net_size-1, category: -1})
            const entry = {net_size: this.state.net_size, n_categories: this.state.category_names.length}
            this.serverCall("/modificarRed/",entry)

        }

    }

    handleTransitionEnd(){
        this.setState({output_on: -1})
    }



    render(){

        return(
            <div style={{padding: 50}}>
                <Grid container spacing={0} justify="center" align="center">
                    <EventListener onKeyUp={this.captureGlobalEvent}/>
                    <Grid item lg={4}>
                        <Container style={{padding: 50}}>
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
                            <Network active = {this.state.output_on} onTransitionEnd = {this.handleTransitionEnd}
                                     images={this.state.images} size={this.state.net_size} n_outputs={this.state.category_names.length}/>
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
