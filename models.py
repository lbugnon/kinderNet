from config_manager import ConfigManager as cm
from flask_restful import Resource, reqparse
import shutil,os,io
from kinderNet import KinderNet
import numpy as np
from PIL import Image
import base64

def dataurl2np(dataurl):
    """
    Funcion auxiliar para convertir los datos de imagen codificados a un PIL Image. 
    """
    data=dataurl.split(";")[1].split(",")[1]
    image_bytes = io.BytesIO(base64.b64decode(data))
    im = Image.open(image_bytes)
    return im

# Inicialización
class Index(Resource):
    """
    Inicialización de los modelos.
    """
    def post(self):
        shutil.rmtree("data/",ignore_errors=True)
        os.mkdir("data/")
        
        #cm("data/","static/config")
        shutil.copyfile("static/config","data/config")
        
        return "ok"# return render_template('index.html')


# Modelo para entrenamiento
class Train(Resource): 
    def post(self): 
      
        parser = reqparse.RequestParser()
        parser.add_argument('category', type=int, help='Category to be classified')
        parser.add_argument('imgSrc', type=str, help='Image data')

        args = parser.parse_args()
        params = cm.load_config()
        img = dataurl2np(args["imgSrc"])
        objclass = args["category"]

        # TODO: guardar las imagenes y entrenar el modelo a partir de las imagenes totales al momento. Dependiendo del costo podríamos ver de usar aumentación directamente.
        # TODO2: Si tardase mucho, se podria armar la idea con sacar N fotos y luego entrenar.
        
        net=KinderNet(params)     
        loss=net.run(img,objclass,train_mode=True)
        net.save()
        cname="nsamples_%d" %objclass
        if cname in params:
            params[cname]=int(params[cname])+1
        else:
            params[cname]=1
    
        cm.save_config(params) 
        
        return {"loss": loss,"nsamples": params["nsamples_%d" %objclass]}

# Modelo para predicción
class Classify(Resource): 
    def post(self): 
        
        parser = reqparse.RequestParser()
        parser.add_argument('imgSrc', type=str, help='image data')

        args = parser.parse_args()
        params = cm.load_config()
        img = dataurl2np(args["imgSrc"])

        
        net=KinderNet(cm.load_config())     
        out=int(net.run(img))

        return {"category": out}

# Modelo para cambios en la red
class ChangeNet(Resource):
    def post(self):
        """
        Modifica la complejidad y cantidad de salidas de la red. 
        """
        parser = reqparse.RequestParser()
        parser.add_argument('netSize', type=int, help='Tamaño de la red (1,2 o 3)')
        parser.add_argument('categoryNames', type=int, help='Cantidad de salidas')
        args = parser.parse_args()
     
        params=cm.edit_config({"categoryNames":args["categoryNames"], "netSize": args["netSize"]})

        # Borramos el modelo anterior
        if os.path.exists("data/model.par"):
            os.remove("data/model.par")
        # Reset de estados
        cm.clear_config()
    
        return {"network_img": "TODO_url"}

