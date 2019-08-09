from flask import Flask, render_template, request, url_for, redirect
from webcam import take_pic
from config_manager import save_config,load_config,edit_config
import shutil,os
from kinderNet import KinderNet

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Cache en horas
app.config["TEMPLATES_AUTORELOAD"] = True

@app.route('/')
def main():
 
    params=load_config("config")

    return render_template('index.html',**params)

@app.route('/entrenar<int:objclass>')
def train(objclass):
    """
    Entrena el modelo con la última figura y la clase dentro del request form. 
    """
    params=edit_config({"input_img": "static/sleepy.jpg"},"config")
    # codigos del teclado, 49=>0
    objclass-=49
    im=take_pic()

    print("entrenando %d" %objclass)
    # TODO Entrenamiento...
    net=KinderNet(int(params["nclases"])) # Levanta los archivos que tenga o empieza de 0, pasa la imagen y guarda los estados.
    
    loss=net.run(im,objclass,train_mode=True)
    print(loss)
    net.save()
    
    return "ok"

@app.route('/changeOut<int:nclases>')
def changeOut(nclases):
    params=load_config()
    print(params)
    print(nclases)
    if nclases==90:
        params["nclases"]=int(params["nclases"])-1
        if params["nclases"]<1:
            params["nclases"]=1
    if nclases=="88":
        print(params["nclases"])
        params["nclases"]=int(params["nclases"])+1
        if params["nclases"]>3:
            params["nclases"]=3

    save_config(params)

    return "ok"

@app.route('/predecir')
def predict():
    """
    Captura una imagen y devuelve la clase predecida por el modelo. 
    """
    params=load_config()
    im=take_pic()

    net=KinderNet(int(params["nclases"]))
    
    out=net.run(im,[],train_mode=False) # prueba
    print("salida: ",out)
    edit_config({"prediccion":out})
    main()
    return "ok"


@app.route('/about')
def about():
    """
    Detalles del sinc.   
    """
    return ':) => www.sinc.unl.edu.ar'  



