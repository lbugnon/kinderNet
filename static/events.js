function setClass(e){
    const key= document.querySelector(`.key[data-key='${e.keyCode}']`);
    console.log(key);
    key.classList.add('playing')
}

window.addEventListener('keydown',setClass);

function removeTransition(e){
    if(e.propertyName !== 'transform') return;
    this.classList.remove('playing')
  
    // TODO: se podria mantener la transformacion mientras entrena o algo asi, ver cuanto tiempo demora
}

const keys=document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('transitionend',removeTransition));
