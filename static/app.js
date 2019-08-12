// Control de version para video
function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
	      navigator.mediaDevices.getUserMedia);
}
if (hasGetUserMedia()) {
} else {
    alert('Este navegador no soporta el display de video');
}
// Video live
var video = document.querySelector('video');
var snapshotCanvas = document.getElementById('snapshot'); // TODO esto solo para verificad el snapshot, se puede sacar
var videoHandler= function(stream){
    video.srcObject = stream;
};
navigator.mediaDevices.getUserMedia({video: true}).
    then(videoHandler);    

// Respuesta a keypress
window.addEventListener('keydown',pic2model);
function pic2model(e){

    var c=0
    // TODO: no deberia generar eventos si las salidas no corresponden a las que tiene el modelo, por ahora se controla en el servidor nomas.
    if ([49,50,51].includes(e.keyCode)){// entrenamiento para una clase
	url=`/entrenar`;
	c=e.keyCode-49;
   }
    else if (e.keyCode==67){
	url=`/clasificar`;
	c=-1; 
    }
    else
	return;
    
    var context = snapshot.getContext('2d');
    context.drawImage(video, 0, 0, snapshotCanvas.width,
		      snapshotCanvas.height);
    var imgData    = snapshotCanvas.toDataURL('image/png');
    
    const audio= document.querySelector(`audio[data-key='${e.keyCode}']`);
    const key= document.querySelector(`.key[data-key='${e.keyCode}']`);
    if(!audio) return;
    audio.currentTime=0;
    audio.play()
    key.classList.add('playing')
    
    var entry = {
	clase: c,
	img: imgData
    };

    fetch(url, {
	method: "POST",
	credentials: "include",
	body: JSON.stringify(entry),
	cache: "no-cache",
	headers: new Headers({
	    "content-type": "application/json"
	})
    })
	.then(function(response){
	    response.json().then(function(json){
		if (c!=-1){
		    document.getElementById("loss").innerHTML = "Loss "+json.loss.toString();
		    document.getElementById("ej"+c.toString()).innerHTML = "Ejemplos de clase "+(c+1).toString()+": "+json.nimages.toString();
		}
		else{
		    document.getElementById("pred").innerHTML = "Prediccion: clase "+json.clase.toString();

		}
	    });
	});
    
} 


// Evento para modificar la estructura de la red y cantidad de salidas
window.addEventListener('keydown',changeNet);
function changeNet(e){

    var nc=0;
    if (e.keyCode == 88)
	nc=3;
    else if (e.keyCode == 90 )
	nc=2;
    else
	return;
    
    const audio= document.querySelector(`audio[data-key='${e.keyCode}']`);
    const key= document.querySelector(`.key[data-key='${e.keyCode}']`);
    if(!audio) return;
    audio.currentTime=0;
    audio.play()
    key.classList.add('playing')

    var entry = {
	nclases: nc,
	netsize: 0  // TODO: si agregamos cambiar la complejidad de la red va a ca
    };

    fetch(`/modificarRed`, {
	method: "POST",
	credentials: "include",
	body: JSON.stringify(entry),
	cache: "no-cache",
	headers: new Headers({
	    "content-type": "application/json"
	})
    })
	.then(function(response){
	    response.json().then(function(json){
	    });
	});
    // F5, TODO esto posiblemente vuele si se hace todo en JS
    window.location.reload()
   
} 

// Transiciones temporales
function removeTransition(e){
    if(e.propertyName !== 'transform') return;
    this.classList.remove('playing')
}
const keys=document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('transitionend',removeTransition));
