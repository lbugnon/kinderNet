import React from 'react';
import './App.css';
import Webcam from "react-webcam";
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline';

// Definiciones globales
const server_url = "http://localhost:5000"
const min_categories = 2
const max_categories = 4
const use_timer = false
const base_timer = 2000

// SampleCounter ===================================
function SampleCounter(props){
    let samplesList = props.n_samples.map((n,i) => <li key={i}>Ejemplos del objeto {i+1}: {n}</li>)
    return(<ul>{samplesList}</ul>);
}




function Neuron(props){

    let style = "visible"
    let face_style = "face"
    if(props.is_hidden){
        style += " hidden"
        }

    let leye, reye, mouth
    const eyex = 7
    const eyey = 5
    const eyer = 3

    let transition_end = ""
    let neuron_face = "neuron-base "
    if (props.is_on){
        if(props.layer <= 1){
            neuron_face += "neuron-on"+props.layer.toString()
        }
        if(props.layer === 2 && props.output_active) {
            transition_end = props.onTransitionEnd
            neuron_face += "neuron-on"+props.layer.toString()
        }
    }

       // <circle key={props.key} onTransitionEnd={transition_end} className={style}
       //             cx={props.x} cy={props.y} />





    return(
        <g  className={style} onTransitionEnd={transition_end} transform={"translate(" + (props.x-25).toString() + " " + (props.y-25).toString() + ") scale(0.12)"}
            >
			<circle fill={"whitesmoke"} cx="245" cy="240.808" r="170"/>
			<path d="M280,190.808c-44.112,0-80,35.888-80,80s35.888,80,80,80c21.36,0,41.456-8.32,56.568-23.432l-11.312-11.312
				c-12.096,12.088-28.16,18.744-45.256,18.744c-35.288,0-64-28.712-64-64c0-35.288,28.712-64,64-64c35.288,0,64,28.712,64,64
				c0,12.728-3.728,25.024-10.776,35.544l13.296,8.904c8.816-13.168,13.48-28.544,13.48-44.448
				C360,226.696,324.112,190.808,280,190.808z"/>
			<path d="M475.416,328.248L448,347.44v-36.632h-16v47.832l-35.056,24.536l-6.072-5.064l-3.04-9.12h-0.008
				c-2.184-6.56-0.968-14.008,3.264-19.912C412.624,319.056,424,283.696,424,246.808c0-22.824-4.312-45.04-12.832-66.048
				c-3.76-9.264-3.168-20.056,1.6-29.608l1.624-3.256l15.344-12.784l27.192,20.392l7.312,29.24l15.512-3.872l-6.064-24.248
				l24.24-6.056l-3.872-15.512l-28.304,7.08l-23.392-17.544l16.536-13.784H496v-16h-32V47.6l7.84-39.216L456.152,5.24l-6.224,31.12
				l-39.4-13.136l-5.064,15.168l42.664,14.224L448,99.048l-43.288,36.072c-11.36,1.256-22.688-2.656-30.648-10.864
				c-26.176-26.936-59.48-44.504-96.304-50.784c-12.76-2.176-23.728-9.92-29.768-20.792V27.088l20.44-13.624L259.56,0.152
				L240,13.192l-19.56-13.04l-8.872,13.312L232,27.088v25.824l-1.04,2.08C225.624,65.664,216,73.456,204.568,76.36
				c-25.144,6.392-49.016,18.592-69.048,35.288c-10.312,8.6-23.56,11.432-35.696,7.904l-11.528-9.88l6.984-41.904l36.832-22.104
				l-8.232-13.72L92.432,50.816L79.584,12.272l-15.168,5.064l15.368,46.112l-5.68,34.056L48,75.128v-52.32H32v48H0v16h37.04
				l6.896,5.912l-32.048,19.232l8.232,13.72l36.624-21.976l32.368,27.744l3.384,10.136c2.936,8.824,2.112,18.648-2.344,27.68
				c-8.496,17.272-14.056,35.728-16.528,54.856c-0.424,3.296-2.624,6.248-5.896,7.88l-12.352,6.176l-18.48-6.16l-22.496-30
				l-12.8,9.6l19.84,26.448L2.344,257.152l11.312,11.312L34.16,247.96l5.84,1.944v49.592l-21.656,21.656l11.312,11.312l17.48-17.48
				L65.6,339.608l12.8-9.592L56,300.144v-44.392l11.736,5.872c3.264,1.632,5.472,4.592,5.896,7.928
				c6.304,48.76,33.12,92.976,73.568,121.32c3.008,2.104,4.8,5.672,4.8,9.544v12.176l-20.952,34.936l-40.984,6.832L60.8,432.408
				l-9.6,12.8l23.464,17.6l-23.464,17.6l9.6,12.8l30.44-22.832l39.728-6.624l13.608,34.024l14.856-5.936l-14.528-36.32
				l21.152-35.248l9.288-6.96c3.272-2.456,7.432-3.08,11.096-1.696c19.776,7.424,40.496,11.192,61.56,11.192
				c36.88,0,72.224-11.344,102.208-32.824c5.4-3.856,12.128-5.048,18.52-3.216l11.44,3.264l19.56,16.296l-13.8,41.376l-43.248,7.208
				l2.624,15.784l40.72-6.784l6.216,24.832l15.512-3.872l-7.432-29.744l12.6-37.8l11.784,9.816l7.448,37.232l15.688-3.144
				l-6.384-31.896l39.848-6.64l-2.624-15.784l-44.384,7.4l-24.616-20.52l74.904-52.432L475.416,328.248z M378.096,339.752
				c-6.592,9.192-8.856,20.664-6.304,31.272c-10.68-2.648-21.872-0.496-30.888,5.952c-27.264,19.52-59.384,29.832-92.904,29.832
				c-19.144,0-37.96-3.424-55.944-10.176c-3.128-1.168-6.376-1.752-9.608-1.752c-5.04,0-10.048,1.4-14.488,4.12
				c-0.424-8.544-4.68-16.408-11.568-21.232c-36.784-25.768-61.16-65.952-66.88-110.256c-1.12-8.632-6.584-16.176-14.616-20.192
				l-1.016-0.512l1-0.496c8.048-4.024,13.504-11.56,14.616-20.16c2.24-17.376,7.288-34.152,15.008-49.832
				c6.224-12.64,7.408-26.56,3.336-39.256c13.536,0.68,26.92-3.944,37.928-13.12c18.2-15.184,39.896-26.264,62.736-32.08
				c13-3.296,24.304-11.112,32.064-21.92c8.704,10.048,20.896,16.992,34.512,19.304c33.456,5.712,63.72,21.68,87.512,46.16
				c8.824,9.088,20.52,14.584,32.888,15.776c-3.928,11.768-3.68,24.384,0.864,35.592c7.736,19.08,11.656,39.28,11.656,60.032
				C408,280.328,397.656,312.472,378.096,339.752z"/>
			<rect x="224" y="110.808" width="16" height="16"/>
			<rect x="128" y="278.808" width="16" height="16"/>
			<rect x="248" y="374.808" width="16" height="16"/>
			<rect x="168" y="190.808" width="16" height="16"/>
			<rect x="152" y="134.808" width="16" height="16"/>
			<rect x="304" y="150.808" width="16" height="16"/>
			<circle className={neuron_face} cx="280" cy="270.808" r="58"/>
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
            nunits = [3, 3, props.n_outputs]
            break
        case 1:
            nunits = [3, 4, props.n_outputs]
            break
        case 2:
            nunits = [3, 5, props.n_outputs]
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

            layers[i][j] = <Neuron key={j} onTransitionEnd={props.onTransitionEnd} is_on={(props.active !== -1)}
                                   is_hidden={(j >= nunits[i])} layer={i} output_active={props.active === j}
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
            text_on={"Probando"} text_off={"Aprendiendo"}/>
        </svg>

    );
}

function Switch (props) {

    const x = props.x + ( -1  + props.on * 2) * props.w/2

    const xpos = props.x - 4.5*props.w

    //<rect className={"text-base"} x={xpos-10} y = {props.y-props.r} width={140} height = {2*props.r}/>

    return(
        <svg>
            <rect x={xpos-20} y={props.y-30} width = {370} height={60} className={"textBox"}/>
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


// progress bar
class CircularProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // Size of the enclosing square
    const sqSize = this.props.sqSize;
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (this.props.sqSize - this.props.strokeWidth) / 2;
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2;
    // Scale 100% coverage overlay with the actual percent
    const dashOffset = dashArray - dashArray * this.props.percentage / 100;

    return (
      <svg
          width={this.props.sqSize}
          height={this.props.sqSize}
          viewBox={viewBox}>
          <circle
            className="circle-background"
            cx={this.props.sqSize / 2}
            cy={this.props.sqSize / 2}
            r={radius}
            strokeWidth={`${this.props.strokeWidth}px`} />
          <circle
            className="circle-progress"
            cx={this.props.sqSize / 2}
            cy={this.props.sqSize / 2}
            r={radius}
            strokeWidth={`${this.props.strokeWidth}px`}
            // Start progress marker at 12 O'Clock
            transform={`rotate(-90 ${this.props.sqSize / 2} ${this.props.sqSize / 2})`}
            style={{
              strokeDasharray: dashArray,
              strokeDashoffset: dashOffset
            }} />
          <text
            className="circle-text"
            x="50%"
            y="50%"
            dy=".3em"
            textAnchor="middle">
            {`${this.props.percentage}%`}
          </text>
      </svg>
    );
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
            accuracy: 0,
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
        if (this.state.category_names.includes(Number(e.key)) && this.state.output_on === -1) {
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
        if ((e.key.toLowerCase() === "c" || e.key.toLowerCase() === "p") && this.state.output_on === -1) {
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
                        </Container>
                        <Grid  container justify="right" align="center">
                            <Grid item sm={5}>
                                <CircularProgressBar strokeWidth="5" sqSize="100"  percentage={Math.floor(this.state.accuracy*100)}/>
                            </Grid>
                            <Grid item sm={6}>
                                <SampleCounter category={this.state.category} n_samples ={this.state.n_samples}/>
                            </Grid>
                        </Grid>
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
