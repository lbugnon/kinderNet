from flask import Flask, render_template, request, url_for, redirect, jsonify, make_response
# from flask_restful import Api, Resource
from config_manager import ConfigManager as cm
import shutil,os,io
from kinderNet import KinderNet
import numpy as np
from PIL import Image
import base64
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Cache en horas
app.config["TEMPLATES_AUTORELOAD"] = True


# api=Api(app)
# class train(Resource): # TODO: conviene hacer un solo objeto con el metodo (train,test?) o es un Train y un Test?
#     def post(self): 
#         return {'image': 'a_file', 'class': 0}
# api.add_resource(train, '/train')

# if __name__ == '__main__':
#     app.run()
    
@app.route('/')
def main():
    """
    Pantalla de bienvenida e inicialización.
    """
    shutil.rmtree("data/",ignore_errors=True)
    os.mkdir("data/")

    #cm("data/","static/config")
    shutil.copyfile("static/config","data/config")
    
    return render_template('index.html')

@app.route('/kindernet')
def application():
    """
    Interfaz principal donde se muestra la red y se producen las interacciones. 
    """
    params=cm.load_config()
       
    return render_template('network.html',**params)


def dataurl2np(dataurl):
    """
    Funcion auxiliar para convertir los datos de imagen codificados a un PIL Image. 
    """
    data=dataurl.split(";")[1].split(",")[1]
    image_bytes = io.BytesIO(base64.b64decode(data))
    im = Image.open(image_bytes)
    return im

@app.route('/entrenar', methods=["POST"])
def train():
    """
    Entrena el modelo con la foto y clase recibida. 
    """
    req = request.get_json()
    objclass=req["clase"]
    img=dataurl2np(req["img"])

    params=cm.load_config()

    net=KinderNet(params)     
    loss=net.run(img,objclass,train_mode=True)
    net.save()

    cname="nimages_%d" %objclass
    if cname in params:
        params[cname]=int(params[cname])+1
    else:
        params[cname]=1
        
    cm.save_config(params) 

    res = jsonify({"loss": loss,"nimages": params["nimages_%d" %objclass]})
    return make_response(res, 200) 

@app.route('/clasificar', methods=["POST"])
def classify():
    """
    Clasifica la imagen recibida, y devuelve su clase. 
    """
    req = request.get_json()
    img=dataurl2np(req["img"])
    
    net=KinderNet(cm.load_config())     
    out=net.run(img)
    
    res = jsonify({"clase": int(out)})
    return make_response(res, 200) 


@app.route('/modificarRed', methods=["POST"])
def changeOut():
    """
    Modifica la complejidad y cantidad de salidas de la red. 
    """
    req = request.get_json()

    params=cm.edit_config({"nclases":req["nclases"], "netsize":req["netsize"]})

    # TODO: modificar la red en función de "netsize" y "nclases"

    # Borramos el modelo anterior
    if os.path.exists("data/model.par"):
       os.remove("data/model.par")
    # Reset de estados
    cm.clear_config()
    
    res = jsonify({"network_img": "TODO_url","nimages": params["nimages"]})
    return make_response(res, 200) 


@app.route('/about')
def about():
    """
    Detalles del sinc.   
    """
    return ':) => www.sinc.unl.edu.ar'  



