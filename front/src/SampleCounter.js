import React from 'react'
// SampleCounter ==========================================
function SampleCounter(props){
    var samplesList = props.nsamples.map((n,i) => <li key={i}>Ejemplos de la clase {i}: {n}</li>)

    //samplesList[props.category] = <b>{samplesList[props.category]}</b>

    return(
        <div className="SamplesList">
            <ul>{samplesList}</ul>
        </div>
    );
}
