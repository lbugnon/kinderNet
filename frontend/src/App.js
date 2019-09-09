import React from 'react';
import './App.css';
import Webcam from "react-webcam";
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline';
import sleepy from "./sleepy.svg"
import awake from "./awake.svg"


// Definiciones globales
const server_url = "http://localhost:5000"
const min_categories = 2
const max_categories = 4
const use_timer = true
const base_timer = 2000

// SampleCounter ===================================
function SampleCounter(props){
    let samplesList = props.n_samples.map((n,i) => <li key={i}>Ejemplos de la clase {i}: {n}</li>)
    return(
       <ul>{samplesList}</ul>
    );

    // let counter = Array(props.n_samples.length)
    // const step = 5
    // for (var i = 0; i< props.n_samples.length; i++){
    //     counter[i] = Array(props.n_samples[i])
    //     for (var j = 0; j< props.n_samples[i]; j++){
    //         counter[i][j] = <circle r={5} x={j*step} y={height/2+i} fill={"black"}/>
    //     }
    // }
    // console.log(counter)
    // return(
    //     <svg width={300} height={200}>
    //         {counter}
    //     </svg>
    //);
}

function Neuron(props){

    let style = "output"
    let face_style = "face"
    if(props.is_on)
        style += " output-on"
    if(props.is_hidden){
        style += " hidden"
        face_style += " hidden"
        }
    let text_style = style + " sleepy-face"

    if(props.is_on){
        const leye =  <circle cx={props.x-10} cy={props.y-10} r={5} className={face_style} />
        const reye =  <circle cx={props.x+10} cy={props.y-10} r={5} className={face_style} />
        const mouth =  <path d={"M"+(props.x-11).toString()+" "+(props.y+10).toString()+" L"+(props.x+11).toString()+" "+(props.y+10).toString()}
                         className={face_style}/>
    else{
        const leye =  <circle cx={props.x-10} cy={props.y-10} r={5} className={face_style} />
        const reye =  <circle cx={props.x+10} cy={props.y-10} r={5} className={face_style} />
        const mouth =  <path d={"M"+(props.x-11).toString()+" "+(props.y+10).toString()+" L"+(props.x+11).toString()+" "+(props.y+10).toString()}
                         className={face_style}/>
    }

    }
    return(
        <g>
            <circle key={props.key} onTransitionEnd={props.onTransitionEnd} className={style}
                    cx={props.x} cy={props.y} />
            {leye}
            {reye}
            {mouth}
        </g>
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
    var layers_face = Array(3)
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
        layers_face[i] = Array(max_units[i])
        ypos[i] =  Array(max_units[i])
        for (let j = 0; j < max_units[i]; j++) {

            ypos[i][j] = height / 2 + unit_sep[i] * (j - nunits[i] / 2)


            layers[i][j] = <Neuron key={j} onTransitionEnd={props.onTransitionEnd} is_on={(i === layers.length - 1 && props.active === j)}
                                   is_hidden={(j >= nunits[i])}
                                   x={xpos[i]} y={ypos[i][j]} />


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


                //lines[ind] = <line key={ind} x1={xpos[i]} y1={ypos[i][j]} x2={xpos[i+1]} y2={ypos[i+1][z]}
                //                   className={style} strokeWidth={"1"} />
                lines[ind] = <path key={ind}
                                   d={"M"+ xpos[i].toString() +" "+ ypos[i][j].toString()+" L" + xpos[i+1].toString() +" "+ ypos[i+1][z].toString()}
                                   className={style} strokeWidth={"1"} />
                ind++
            }

    const im_height = 100
    const category_display = props.images.map((v, k) => <image key={k} xlinkHref={props.images[k]}
                                                               x={xpos[2]+layer_sep/3} y={Math.floor(ypos[2][k])-im_height/2}
                                                               viewBox={"0 0 1 1"}
                                                               width={im_height} height={im_height} preserveAspectRatio="xMidYMid slice"/>)


    return (
        <svg  width={width} height={height} className={"shadow"}>
            {lines}
            {layers}
            {category_display}
            <Switch r={12} w={layer_sep/5} x={xpos[1]} on={props.classifying} y={height/2 + 200} // dynamic y={height/2+nunits[1]*(40+10*(nunits[2]==4))}
            text_on={"Clasificando"} text_off={"Aprendiendo"}/>
        </svg>
    );
}

function Switch (props) {

    const x = props.x + ( -1  + props.on * 2) * props.w/2

    const xpos = props.x - 4.5*props.w

    //<rect className={"text-base"} x={xpos-10} y = {props.y-props.r} width={140} height = {2*props.r}/>

    return(
        <svg>
            <rect className={props.on ? "switch-base switch-base-on": "switch-base"} rx={props.r}
                  x={props.x-props.w/2-props.r} y={props.y-props.r} width={props.w+2*props.r} height = {2*props.r}/>
            <circle className={props.on ? "switch switch-on": "switch"} cx={x} cy={props.y} r={props.r*1.4}/>

            <text className={props.on ? "text": "text text-on"} x={xpos} y={props.y+7}>{props.text_off}</text>

            <text className={props.on ? "text  text-on": "text"} x={props.x + 1.3*props.w} y={props.y+7}>{props.text_on}</text>
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
            classifying: false,
            net_size: 0, // mayor valor, mas compleja la red
            category_names: [1,2],
            images: [[],[]],
            loss: 0,
            n_samples : [0,0], // n_samples  de la clase actual durante el entrenamiento
            output_on: -1,
            trained: false,
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

        if(!this.state.trained){
            setTimeout(this.handleTimerOut,this.state.timer)
            return
        }
        if (!this.state.classify){
            this.setState({classify: true})
            setTimeout(this.handleTimerOut,this.state.timer)
            return
        }

        this.setState({timer : 500})
        this.classifyPic()

        setTimeout(this.handleTimerOut,this.state.timer)
        return
    }

    // async to wait for classification results
    serverCall(url,entry){

        const res = async () => {
            return await fetch(server_url + url, {
                method: "POST",
                body: JSON.stringify(entry),
                headers: new Headers({"content-type": "application/json"})
            })
        }
        return res().then(response => response.json()).then(json => this.setState(json))
        // TODO parece que el asyncc no esta funcionando
    }

    classifyPic(){
        const imgSrc = this.webcam.getScreenshot()
        const entry = {imgSrc}
        //this.setState({category: -1})
        const response = this.serverCall("/clasificar/", entry)
        /this.setState({classify: true, classifying: true})
        }

    captureGlobalEvent(e) {

        // entrenamiento
        if (this.state.category_names.includes(Number(e.key))) {
            let images = this.state.images.slice()
            const category = Number(e.key)-1
            images[category] = this.webcam.getScreenshot()
            const entry = {category, imgSrc: images[category]}
            this.setState({classify: false, classifying: false,  category, output_on: Number(e.key)-1,
                images, timer: base_timer, trained: true})
            const response = this.serverCall("/entrenar/",entry)
            response.then(json => this.setState(json))
        }

        // test
        if (e.key.toLowerCase() === "c") {
            this.classifyPic()
            this.setState({timer: 500})

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
            this.setState({trained: false, timer: base_timer})
        }

    }

    handleTransitionEnd(){
        this.setState({output_on: -1})
    }





    render(){
        const videoConstraints = {
            width: 350,
            height: 350,
            facingMode: "user"
        };
        return(
            <div style={{padding: 50}}>
                <Grid container spacing={0} justify="center" align="center">
                    <EventListener onKeyUp={this.captureGlobalEvent}/>
                    <Grid item sm={4}>
                        <Container style={{padding: 50}}>
                            <Webcam
                                videoConstraints = {videoConstraints}
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
                    <Grid item sm={8}>
                        <Container>
                            <Network active = {this.state.output_on} onTransitionEnd = {this.handleTransitionEnd}
                                     images = {this.state.images} size = {this.state.net_size} n_outputs = {this.state.category_names.length}
                            classifying = {this.state.classifying}/>
                        </Container>
                    </Grid>
                </Grid>
            </div>


        );
    }

}


function App() {
  return (
      <React.Fragment>
          <CssBaseline />
          <div>
              <KinderNet />
          </div>
      </React.Fragment>

  );
}

export default App;
