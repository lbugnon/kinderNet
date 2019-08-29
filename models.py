from flask_restful import Resource, reqparse
import shutil
import os
import io
import base64
import json
from kinderNet import KinderNet
from PIL import Image

conf_file = "data/config.json"


def data2img(data: str) -> Image:
    """
    Convert the string-coded image to PIL.Image.

    :param data: String with Image data coded in.
    :return: PIL.Image
    """
    data = data.split(";")[1].split(",")[1]
    image_bytes = io.BytesIO(base64.b64decode(data))
    img = Image.open(image_bytes)
    print(img.size)

    # Crop 25% of the margins (TODO check webcam compat)
    w, h = img.size
    wc = w//4
    hc = h//5
    img = img.crop((wc, hc, w-wc, h-hc))
    print(img.size)
    return img


def save_img(img: Image, category: int, ind: int = 0):
    """
    Save img in the data folder.

    :param img: Image to save.
    :param category: Class of the image.
    :param ind: The number of sample of that class.
    :return: None
    """
    params = json.load(open(conf_file))
    img.save("{}cat{}/img{}.png".format(params["img_dir"], category, ind))


class Index(Resource):
    """
    Model initialization.
    """
    def post(self):
        params = json.load(open("static/config.json"))
        model_dir = params["model_dir"]
        img_dir = params["img_dir"]
        shutil.rmtree("data/", ignore_errors=True)
        if not os.path.isdir("data/"):
            os.mkdir("data/")
        os.mkdir(model_dir)
        os.mkdir(img_dir)

        shutil.copyfile("static/config.json", conf_file)

        for k in range(params["n_categories"]):
            os.mkdir("{}/cat{}/".format(img_dir, k))
        return "ok"


class Train(Resource):
    """
    Train model. Incoming images are saved to the img_dir, and then the network is trained with a batch.
    """
    def post(self):
      
        parser = reqparse.RequestParser()
        parser.add_argument('category', type=int, help='Category to be classified')
        parser.add_argument('imgSrc', type=str, help='Image data')

        args = parser.parse_args()
        params = json.load(open(conf_file))
        img = data2img(args["imgSrc"])
        category = args["category"]

        save_img(img, category, params["n_samples"][category])

        net = KinderNet(params)
        loss = net.run_train()
        net.save()

        params["n_samples"][category] += 1

        json.dump(params, open(conf_file, "w"))
        
        return {"loss": loss, "n_samples": params["n_samples"]}


class Classify(Resource): 
    """
    Use the trained network to classify the incoming image.
    """
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('imgSrc', type=str, help='image data')

        args = parser.parse_args()
        params = json.load(open(conf_file))
        img = data2img(args["imgSrc"])

        img.save("{}/test.png".format(params["img_dir"]))
        
        net = KinderNet(params)
        out = int(net.run_test(img))

        return {"category": out, "output_on": out}


class ChangeNet(Resource):
    def post(self):
        """
        Change the network complexity and its number of outputs.
        """
        parser = reqparse.RequestParser()
        parser.add_argument('netSize', type=int, help='Network size (1,2 o 3)')
        parser.add_argument('n_categories',  help='Number of outputs')
        args = parser.parse_args()

        n_cat = int(args["n_categories"])

        params = json.load(open(conf_file))

        params_changed = {"net_size": args["netSize"], "n_categories": n_cat, "n_samples": [0 for x in range(n_cat)]}
        params.update(params_changed)

        json.dump(params,open(conf_file, "w"))

        shutil.rmtree(params["img_dir"])
        os.mkdir(params["img_dir"])
        for n in range(n_cat):
            os.mkdir("{}cat{}/".format(params["img_dir"],n))

        if os.path.exists(params["model_dir"] + "model.par"):
            os.remove(params["model_dir"] + "model.par")
        
        return {"network_img": "TODO_url", "n_samples": params["n_samples"]}

