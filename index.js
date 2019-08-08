// Control de ventana
const {app, BrowserWindow} = require('electron')

var python = require('child_process').spawn('python3', ['./main.py']);
    
function newWindow(){
    window= new BrowserWindow({width: 600, height: 400})
    window.loadFile('index.html')

    // salida por consola
    python.stdout.on( 'data', function(data){
    	console.log("data: ",data.toString('utf8'));
    });

}
app.on('ready',newWindow)

app.on('window-all-closed', () => {
    python.kill();
    app.quit()
    
})


