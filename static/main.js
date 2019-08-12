function enter(e){
    if(e.keyCode!=13)
	return;
    window.location.replace("/kindernet")
}    
window.addEventListener('keydown',enter);
