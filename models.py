from flask_restful import Resource, reqparse
import shutil,os,io
from kinderNet import KinderNet
import numpy as np
from PIL import Image
import base64, json

conf_file = "data/config.json"
data_dir = "data/"

def dataurl2im(dataurl):
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
        shutil.rmtree(data_dir,ignore_errors=True)
        os.mkdir(data_dir)
        
        shutil.copyfile("static/config.json","data/config.json")

        params = json.load(open(conf_file))
        os.mkdir(data_dir+"img/")
        for k in range(params["ncategories"]):
            os.mkdir("{}img/cat{}/".format(data_dir,k))
        
        return "ok"


def saveImg(img,category,ind):
    """
    Guarda la imagen en un directorio en disco según la categoria asignada. 
    """
    params = json.load(open(conf_file))
    img.save("{}img/cat{}/img{}.png".format(data_dir,category,ind))

# Modelo para entrenamiento
class Train(Resource): 
    def post(self): 
      
        parser = reqparse.RequestParser()
        parser.add_argument('category', type=int, help='Category to be classified')
        parser.add_argument('imgSrc', type=str, help='Image data')

        args = parser.parse_args()
        params = json.load(open(conf_file))
        img = dataurl2im(args["imgSrc"])
        category = args["category"]

        saveImg(img,category,params["nsamples"][category])
        
        
        net=KinderNet(params)     
        loss=net.run(img,category,train_mode=True)
        net.save()

        params["nsamples"][category]+=1

        json.dump(params, open(conf_file,"w"))
        
        return {"loss": loss,"nsamples": params["nsamples"]}

# Modelo para clasificación.
class Classify(Resource): 
     """
     Utiliza el modelo actual para hacer la clasificación. La imagen recibida se guarda en un buffer en disco de tamaño batch * ncategories. Si se capturan más imágenes que el batch de una misma clase, se sobreescriben las primeras. 
     """
     def post(self): 
        
        parser = reqparse.RequestParser()
        parser.add_argument('imgSrc', type=str, help='image data')

        args = parser.parse_args()
        params = json.load(open(conf_file))
        img = dataurl2im(args["imgSrc"])

        
        net=KinderNet(params)     
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
        parser.add_argument('ncategories',  help='Cantidad de salidas')
        args = parser.parse_args()

        print(args["ncategories"])
        ncat = int(args["ncategories"])

        params = json.load(open(conf_file))


        # reset contadores
        
        params_changed={"net_size":args["netSize"], "ncategories": ncat, "nsamples": [0 for x in range(ncat)]}
        params.update(params_changed)

        json.dump(params,open(conf_file,"w"))
        
        # Borramos el modelo anterior
        if os.path.exists("data/model.par"):
            os.remove("data/model.par")
        
        return {"network_img": "TODO_url", "nsamples": params["nsamples"]}

