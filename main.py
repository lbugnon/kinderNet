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
    """
    Pantalla de bienvenida e inicialiación.
    """
    params=load_config("static/config")
    shutil.rmtree("data/",ignore_errors=True)
    os.mkdir("data/")
    save_config(params,"data/config")

    shutil.copyfile("static/white-noise.jpg","data/pic.jpg")
    
    return render_template('index.html')

@app.route('/kindernet')
def application():
    """
    Interfaz principal donde se muestra la red y se producen las interacciones. 
    """
    params=load_config()
       
    return render_template('network.html',**params)

@app.route('/entrenar<int:objclass>')
def train(objclass):
    """
    Entrena el modelo con la última figura y la clase dentro del request form. 
    """

    params=load_config()
    # codigos del teclado, 49=>0
    objclass-=49

    print("entra entrenar %d" %objclass)

    # im=take_pic()
    # print("entrenando %d" %objclass)
    # net=KinderNet(int(params["nclases"]))     
    # loss=net.run(im,objclass,train_mode=True)
    # ## TODO el loss se podria mostrar en la misma pagina, algo que se pueda ocultar despues
    # print(loss)
    # net.save()
    
    return "ok"

@app.route('/changeOut<int:nclases>')
def changeOut(nclases):
    params=load_config()
    if nclases==90:
        params["nclases"]=2
    if nclases==88:
        params["nclases"]=3

    print(params)
    print(nclases)
    
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



